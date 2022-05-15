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

exports.register = (req, res) => {
  res.send("Thanks for trying to register!")
}

// This is the function which gonna be called when some1 visits the base url
// If they're loggedin they would see personalized dashboard
// But if they're not loggedin they should just see guest home page template
exports.home = (req, res) => {
  res.render('home-guest')
}

// @TODO why we have to require('express') in router.js and not here, maybe cuz we aren't using any express code here? idk, gotta check for sure