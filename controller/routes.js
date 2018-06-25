// const mongoose = require('mongoose');
const db = require('../models');

// Require request and cheerio. This makes the scraping possible
const request = require('request');
const cheerio = require('cheerio');

module.exports = (app) => {
  app.get('/', (req, res) => {
    db.Article.find({}).sort({ date: -1 })
      .populate('comment')
      .then((dbArticle) => {
        res.render(
          'index',
          {
            dbArticle: dbArticle,
          },
        );
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get('/saved', (req, res) => {
    db.Article.find({ saved: true }).sort({ date: -1 }).populate('comment').then((dbSaved) => {
      // console.log(dbSaved);
      res.render(
        'saved',
        {
          dbSaved: dbSaved,
        },
      );
    })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get('/scrape', (req, res) => {
    // Request
    request('https://www.mprnews.org/', function (error, response, html) {
      if (error) {
        console.log(error);
      }

      const $ = cheerio.load(html);

      let results = [];

      $('h2').each(function (i, element) {
        const title = $(element).text();
        const link = $(element).parent().attr('href');
        // const img = $(element).next('img').attr('src');
        const summary = $(element).siblings('div').text();

        results.push({
          title: title,
          link: link,
          // img: img,
          summary: summary,
        });
      });

      // console.log(results);
      results.forEach((article) => {
        db.Article.findOne({ title: article.title }, (err, title) => {
          if (err) {
            console.log(err);
          }
          if (!title) {
            db.Article.create(article).then((dbArticle) => {
              console.log(dbArticle);
              // window.location.reload(true);
            }).catch(function (error) {
              // If an error occurred, send it to the client
              return res.json(error);
            });
          }
        });
      });
    });
    res.send('Scrape Complete');
  });

  app.get('/articles/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate('comment')
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post('/articles/:id', function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function (dbComment) {
        console.log(dbComment.text);
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment._id } }, { new: true });
      })
      .then(function (dbArticle) {
        console.log(dbArticle);
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // update article saved status
  app.post('/articles/saved/:id', (req, res) => {
    console.log(req.body.saved.saved);
    let isSaved = false;
    if (req.body.saved.saved === 'true') {
      isSaved = true;
    }

    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: isSaved }, { new: true }, (err, article) => {
      if (err) console.log(err);
    }).then((dbArticle) => {
      res.json(dbArticle);
    });
  });
};
