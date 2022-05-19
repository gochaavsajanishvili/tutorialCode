// We're gonna require our post model, so it's a blueprint aka class, so it will be first letter uppercase
// Then we can leverage this in the body of our functions, in this case create() function
const Post = require('../models/Post')

// Here we will start exporting the functions which our router is gonna call
exports.viewCreateScreen = function(req, res) {
  // Added second arg to fix avatar in new create-post template, did it all by myself
  // Brad passed username here too, idk what for when there is only avatar shown so I will
  // Not perform that action but leave the code for it here in comments in any case
  // username: req.session.user.username

  // We remove second arg as we are improving the reusability, but I will save code here for future
  // reference {avatar: req.session.user.avatar}
  res.render('create-post')
}

exports.create = function(req, res) {
  // Within the body of this function we just wanna store whatever values users typed in a title and body content fields
  // We wanna store them in the database, however, lets remember that any sort of data management should really be done
  // Within our model, not within our controller, so now we are going to create a post model
  // Here our post variable equals to our blueprint or a model of what a post should be, within the parenthesis, we want to pass to our blueprint
  // req.body which will contain form data that a visitor just submitted
  // We know that lowercase post or our post variable is going to be an object and we haven't actually created any methods within our blueprint yet
  // But soon we will create a method named create within our model and we can set this method up to return a promise, and promise can either
  // Resolve or reject, so after the promise we can write .then() and .catch(), then() will solve the things if the promise is successful
  // Or resolves and catch() will handle things if promise fails things or rejects, so within both of them, lets provide functions and this time
  // I won't risk with arrow functions till I understand them completely, I will just go with what Brad tolds me to :d
  // Actually I think I'm starting to understand the difference between model and controller

  // We can also pass here the current user id from session data, but if we are going to do that, we need to make sure that whenever
  // A user logs in or registers, that we are actually storing that id value in the current session data
  // We will do it from our userController file and then we can leverage that id which will now exist in the session data
  // Btw we type req because it is an object where the needed information is stored
  // Finally we will leverage this in our post model
  let post = new Post(req.body, req.session.user._id)
  post.create().then(function() {
    // Here if the post was successfully created, what we actually want to do is, redirect the user to the new url for that post
    // And maybe have a green success flash message that says New post successfuly created
    res.send("<h1 style='color: green;'>New post created.</h1>")
  }).catch(function(errors) {
    // Here, we can imagine that when our promise rejects, it's gonna reject back with an array of errors, so within the parenthesis of this
    // Function we will include a param named errors to receive that array
    res.send(`<h1 style="color: red;">${errors}</h1>`)
  })
}

// So if user is not logged in and visits create-post url, user should be redirected to the home page
// With the red flash error message that says user must be logged in to perform that action
// Now we could add that logic into our postController action here, but it is pretty common thing
// That we want to do, restrict the route so that only logged in users can access it
// So instead of duplicating the logic that enforces that in maybe 20-30 different controller functions
// Why don't we instead create one single reusable function within our userController and we can name it
// mustBeLoggedIn()

// Okay so now what are we doing is includes, when we have similar parts in templates, we want to reuse those 
// Parts across all templates but from a single file, that way we not only shrink our code, but also
// Make it easier to apply changes once and then they will be applied everywhere
// For that we create within our views folder, the subfolder named includes
// Technically we can name it anything, but it is a common name to use
// Inside that includes folder we create new file named header.ejs, so this is because we will be separating
// Header code from the template, it means we name a file depending on what part of template we write there
// For example header, footer, aside and etc.
// So in the template where we want the reusable part to be added we write <%- include(filepath/filename) %>
// And that's all, include is an ejs function
// Also as the included file isn't javascript we don't want to run it but actually to print it
// So we write - symbol after opening percentage and we write - because = sign escapes it and we don't need
// To escape it, as the template is created by us and we trust it (whatever that means @TODO gotta figure
// That out)

// Another area where we can avoid duplication is when we pass session data to the current template
// We go to app.js

// Brad is really into reusability in this lesson :d, now we will make reusable the home-guest header part
// And will give it a logic, so if user will be logged in, the login form will not be given and vice verse
// So we go to home-guest.ejs and copy login form to clipboard, we are going to move that into our shared
// Header include file and then check to see if there is an user object on the session, if there's not, then we can show them this guest form
// Instead of top right menu

// Omg here we go again, again with reusability, relax not that I don't like it, just messing around, I actually am a fan of reusability and
// This is really interesting for me!
// Okay so now we go with footer, if I knew, I'd not change dates in all files -_-