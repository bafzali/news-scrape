// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// // Require request and cheerio. This makes the scraping possible
// const request = require('request');
// const cheerio = require('cheerio');

// Initialize Express
const app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// // Require all models
// const db = require('./models');

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

require('./controller/routes')(app);

// Listen on port 3000
app.listen(process.env.PORT || 3000);
// , function () {
//   console.log('App running on port 3000!');
// });
