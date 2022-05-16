// ../ is how we move up one directory or folder
// We will now learn how to create a javascript object using this blueprint or constructor function
const User = require('../models/User')

// Our goal in this file is to export multiple functions that can be accessed from another javascript file
// Now we gonna use alternative way of exporting from this file instead of listing functions in object like this
// module.exports = {login: function() {...}, logout: function() {...}}, we will use cleaner way
// To export multiple functions from a file, after . we make up a property name and set that to equal whatever we want
// In this case to a function, now when the node environment sees this code it's going to know what to do with it
// It will make sure that property named login will be added to what's going to be exported from the file
exports.login = (req, res) => {
  let user = new User(req.body)
  // Okay so we will now go to our user model where we will create this login() method
  // Remember because it's model not controller that handles the business logic and managing all our data
  // So in terms of looking up a username and password in the database that should definitely be done in our model
  // Not in our controller
  
  // We don't know how long this login() method is going to take, because it's working with the database
  // We have to wait till login() method finishes its job and then send our response to the browser
  // There are many ways to set this up but for now we will use traditional and later best practice approach
  // Traditional approach is called callback function, since we don't know how long login() method will take
  // We can provide it a function as an argument, so that function is an arg that's going to get passed in to our
  // Login function, so back in a User model file, when we are defining what this login() method should be
  // We should receive that incoming function with a parameter, we will call it callback
  // So we are passing this anonym function as an argument into login and then when we define that login function
  // We are waiting until the perfect moment to call that function, in other words we know that this function
  // Is not going to run until the appropriate moment and as in model we are passing strings rn, we added here result param to receive them
  user.login(function(result) {
    res.send(result)
  })
}

exports.logout = () => {

}

// This router is gonna call the function whenever some1 submits the register form
exports.register = (req, res) => {
  // With this console.log we confirmed that our controller is able to access visitors input
  // Our next step will be to validate this data and enforce our rules or business logic on it 
  // console.log(req.body)
  // new keyword is going to create new object using User() blueprint
  // So about uppercase, we do not have to capitalize it, it's just a common convention or preference amongst many programmers
  // To capitalize your blueprint (why he calls class a blueprint I don't get it, it kinda frustrates me, cmon' Brad, start calling it a class already!)
  // I mean I know that class is a blueprint of an object but well.. okay whatever it's 5am I wanna go to bed :d 7th hour of study goddammit
  // Okay so we capitalize the blueprint name so it will be easier to distinguish it from the object which we are creating from it
  // Within parenthesis we have to pass here form field values that visitor just submitted
  let user = new User(req.body)
  user.register()
  // Any value other than 0 evaluates to true so if there are any errors we will send them back to the user here
  // In the future we will set things up so that controller won't even need to have this basic logic of checking the errors array
  // Ideally even this sort of logic should be left to model, not to controller 
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Congrats, there are no errors.")
  }
}

// This is the function which gonna be called when some1 visits the base url
// If they're loggedin they would see personalized dashboard
// But if they're not loggedin they should just see guest home page template
exports.home = (req, res) => {
  res.render('home-guest')
}

// @TODO why we have to require('express') in router.js and not here, maybe cuz we aren't using any express code here? idk, gotta check for sure