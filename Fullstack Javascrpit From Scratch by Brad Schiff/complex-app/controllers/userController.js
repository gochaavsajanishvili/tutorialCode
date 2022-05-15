// ../ is how we move up one directory or folder
// We will now learn how to create a javascript object using this blueprint or constructor function
const User = require('../models/User')

// Our goal in this file is to export multiple functions that can be accessed from another javascript file
// Now we gonna use alternative way of exporting from this file instead of listing functions in object like this
// module.exports = {login: function() {...}, logout: function() {...}}, we will use cleaner way
// To export multiple functions from a file, after . we make up a property name and set that to equal whatever we want
// In this case to a function, now when the node environment sees this code it's going to know what to do with it
// It will make sure that property named login will be added to what's going to be exported from the file
exports.login = function() {
  
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
  res.send("Thanks for trying to register!")
}

// This is the function which gonna be called when some1 visits the base url
// If they're loggedin they would see personalized dashboard
// But if they're not loggedin they should just see guest home page template
exports.home = (req, res) => {
  res.render('home-guest')
}

// @TODO why we have to require('express') in router.js and not here, maybe cuz we aren't using any express code here? idk, gotta check for sure