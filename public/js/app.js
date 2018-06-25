$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('.modal').modal();

  $('.scrape').on('click', function (event) {
    event.preventDefault();

    $.ajax({
      method: 'GET',
      url: '/scrape',
    }).then(function() {
      window.location = '/';
    });
  });

  $('.save-article').on('click', function (event) {
    event.preventDefault();

    const thisId = $(this).attr('data-id');
    console.log(`id is ${thisId}`);

    let body = {
      saved: 'true',
    };

    $.ajax({
      method: 'POST',
      url: `/articles/saved/${thisId}`,
      data: {
        saved: body,
      },
    }).then((data) => {
      window.location.reload(true);
    });
  });

  $('.unsave-article').on('click', function (event) {
    event.preventDefault();

    const thisId = $(this).attr('data-id');
    console.log(`id is ${thisId}`);

    let body = {
      saved: 'false',
    };

    $.ajax({
      method: 'POST',
      url: `/articles/saved/${thisId}`,
      data: {
        saved: body,
      },
    }).then((data) => {
      window.location.reload(true);
    });
  });

  // Whenever someone clicks an add comment button
  $('.add-comment').on('click', function (event) {
    $('#article-for-comment').empty();
    $('#user-comment').val('');
    event.preventDefault();
    // Save the id from the button
    const thisId = $(this).attr('data-id');

    $.ajax({
      method: 'GET',
      url: `/articles/${thisId}`,
    }).then(function (data) {
      console.log(data);
      // The title of the article
      $('#article-for-comment').append(`"${data.title}"`);
      // A button to submit a new note, with the id of the article saved to it
      $('#submit-comment').attr('data-id', data._id);
      console.log(data.comment);

      if (data.comment) {
        $('#article-for-comment').append(data.comment);
      }
    });
  });

  // When you click the savenote button
  $('#submit-comment').on('click', function () {
    // Grab the id associated with the article from the submit button
    const thisId = $(this).attr('data-id');

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: 'POST',
      url: `/articles/${thisId}`,
      data: {
        text: $('#user-comment').val(),
      },
    }).then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $('#article-for-comment').empty();
      $('#user-comment').val('');
    });
  });
});
