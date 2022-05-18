// Here we will start exporting the functions which our router is gonna call
exports.viewCreateScreen = function(req, res) {
  // Added second arg to fix avatar in new create-post template, did it all by myself
  // Brad passed username here too, idk what for when there is only avatar shown so I will
  // Not perform that action but leave the code for it here in comments in any case
  // username: req.session.user.username
  res.render('create-post', {avatar: req.session.user.avatar})
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