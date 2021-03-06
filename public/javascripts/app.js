console.log('app.js loaded');
// globally define jquery variables to be used later
// the entire new post form
var $form;
// company from new post
var $postCompany;
// interviewed of new post - true or false
var $interviewed;
// was it a positive experience
var $posExp;
var $bonusTips;
var $postContent;
var $postItem;
var $postsListSensei;
var $postsListGrasshopper;

// fcn to dynamically create an html representation of the json returned from the json
// THIS IS WORKING
function createPostHTML(post) {
  return $('<li id="post-' + post._id +
  '" class="groupList interviewed-' + post.interviewed
  + ' list-group-item"><p>Company: <strong>' + post.company
  + ' </strong></p><br> ' + post.content + '<br><span class="remove-post" style="float:right;">Delete</span></li>'
  );
}

/////////////////////////////////////////////////
//////////////GET BY ID AND DELETE///////////////
/////////////////////////////////////////////////

// A function that will poull out the id from the li so I don't need to add the id to both the span for the delete and the checkbox for the update.
function getId(jqueryThing) {
  return jqueryThing.attr('id').slice(5);
}

// Define function that will get executed when the checkbox is clicked
function updateHandler(e) {
  // Grab the parent li of the checkbox that triggered the event
  var html = $(this).parent();
  // Get the id of the todo we are updating
  var id   = getId(html);
  // User AJAX to update the todo in our db
  $.ajax({
    type: "PATCH",
    url: "/api/posts" + encodeURIComponent(id),
    data: {} // Since we are only allowing the basic update of changing the todo completed status, I am skipping properly putting together the data of the todo because we will not need it in this special use case.
  }).then(
    function(jsonPost) {
      // Remove the old todo
      html.remove();
      // Create a new html snippet to represent the updated todo.
      var postHTML = createPostHTML(jsonPost);
      // Put the html for the updated todo in the appropriate column
      // if(jsonTodo.completed) {
      //   $personalTodo.append(todoHTML);
      // } else {
      //   $bootsyTodo.append(todoHTML);
      // }
    }
  )
}

// Define function that will get executed when the X is clicked on.
function deleteHandler(e) {
  console.log("deleteHandler enabled")
  // Grab the parent li of the span
  var html = $(this).parent();
  // Get the id of the todo we are deleting
  var id = getId(html);
  // Use AJAX to delete the todo from our db
  $.ajax({
    type: "DELETE",
    url: "/api/posts/" + encodeURIComponent(id)
  }).then(
    // Use jquery to remove it from the DOM
    function(jsonPost) {
      html.remove();
    }
  );
}

// wait for the doucment to load before performing the following
$(document).ready(function() {
  // grab all needed DOM elements
  // column that we are showing all the posts in
  $senseiPosts      = $('#sensei-posts');
  $grasshopperPosts = $('#grasshopper-posts');
  $form             = $('#new-post');
  $postCompany      = $('#post-company');
  $postBonusTips    = $('#post-bonusTips');
  $interviewed      = $('input[name=optionsRadios1]:checked');
  $posExp           = $('input[name=optionsRadios2]:checked');
  $postContent      = $('#post-content');

  //get all posts json using ajax
  $.ajax({
    method: 'GET',
    url: '/api/posts'
  }).then(
    // pass it what the ajax req came back with
    function listPosts(jsonPosts) {
      // iterate through our array of posts
      jsonPosts.forEach(function(jsonPost) {
        // convert to html
        var postHTML = createPostHTML(jsonPost);
          console.log(postHTML);
        // check if post is a completed interview and make it the correct color
        if (jsonPost.interviewed) {
          $senseiPosts.append(postHTML);
        } else {
          $grasshopperPosts.append(postHTML);
        }
      })
    }
  )

  $form.on('submit', function(e) {
    // stop the default behavior from clicking on the submit buttton
    e.preventDefault();

    $interviewed      = $('input[name=optionsRadios1]:checked');

    // create the new post from the values of the form fields
    var newPost = {
      company      : $postCompany.val(),
      content      : $postContent.val(),
      interviewed  : $interviewed.val(),
      positive_exp : $posExp.val()
      // bonus_tips   :
    }

    console.log(newPost)
    // use ajax to add the new todo to our db:

    $.ajax({
      method: 'POST',
      url:    '/api/posts',
      data:   newPost
    }).then( // can pass 2 cb's in case of success or failure
      // what to do if ajax request was succesful
      function(jsonPost) {
        // clear the form if successfully saved
        $postCompany.val('');
        $postContent.val('');
        $interviewed.val('');
        $posExp.val('');
        $postBonusTips.val('');
        // return new post as json
        return jsonPost;
      },
      // what to do if the request failed
      function(err) {
        console.log('Failed: ', err);
      }
    ).then(
      function(jsonPost) {
        // use previously defined fcn to create an html representation of the post
        var postHTML = createPostHTML(jsonPost);
        // append the html post to the DOM
        if (jsonPost.interviewed) {
          $senseiPosts.append(postHTML);
        } else {
          $grasshopperPosts.append(postHTML);
        }
      }
    )
    /*disappear*/
    $(this).click(function() {
        $("#collapseOne").removeClass('in');
    });
  })

// Attach event handlers through delegation.
 // When a selector is provided(as the second argument, i.e. ":checkbox" or ".remove-item"), the event handler is referred to as delegated. The handler is not called when the event occurs directly on the bound element, but only for descendants (inner elements) that match the selector.
 $senseiPosts.on("click", ":checkbox", updateHandler);
 $grasshopperPosts.on("click", ":checkbox", updateHandler);
 $senseiPosts.on("click", ".remove-post", deleteHandler);
 $grasshopperPosts.on("click", ".remove-post", deleteHandler);


});
