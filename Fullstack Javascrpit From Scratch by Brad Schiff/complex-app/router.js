// It's the routers job to list out all of the urls or routes that we are on a lookout for
// So here we have to start by including the express framework so it's code would work here
const express = require('express')
// This way express will return some sort of mini application or a router, which means as I understand it that now we just granted a specific
// Functionality to the variable which is needed for router things only, that's why it's mini, we don't use full force of express here
// As it's not needed
const router = express.Router()
// We have to first require or import controller to then use it's functions, with ./ we look within the current directory starting from root
// No need to include .js when we require the file 
const userController = require('./controllers/userController')
// So as I get it, to work in current file with the code of another file, we need to require that
// Another file in current file
const postController = require('./controllers/postController')

// This is same as app.get() or app.post() it works exactly the same way

// User related routes
router.get('/', userController.home)
router.post('/register', userController.register)
// The second arg is a function that we want to call in response to this happening
router.post('/login', userController.login)
router.post('/logout', userController.logout)

// Post related routes
// Express lets us run multiple functions in response to given route
// So we add userController.mustBeLoggedIn function anywhere where we want the route to be
// Restricted for not loggedin users
// So with that new mustBeLoggedIn() function, we can just check to see if there is a user object within the current session
// If there's not, we can just redirect them to home page with an error message
// But if there is a user object within the session, we can just say next(), where we tell express to run next function on that route
// So then express actually would call next function, but effectively only logged in users will effectively get there
router.get('/create-post', userController.mustBeLoggedIn, postController.viewCreateScreen)

// We are exporting the router variable of ours, that's what we are exporting and making available to any file that requires in, this file
// As I get it, we do this to make possible from the file where we require this router file to use the router functionalities
// @TODO The question is, why don't we just use those functionalities from full express package, maybe it is for files where also
// Only narrow amount of express force is used, gotta figure out for sure
module.exports = router

// Router has the responsibility of directing the traffic
// For example if request comes from '/' this route () => {...} this should happen
// Brad says that it gonna be better that routes instead of having functions and their declarations by themselves, it would be perfect
// To just have to call said functions and having those functions organized in separate controller files
// The router shouldn't contain the logic for the app, it just must be a simple list of routes, that should be its only real responsibility
// So instead we can split this functions out so that they live in a separate file and this is exactly where the idea of a controller comes to play
// So we create in the root of our project folder the subfolder named controllers
// There is nothing special in names of files we created in controllers folder, Brad just chose them due to nature of this web application
// We created userController because we are going to have user accounts that you can register for or log in and log out
// We created postController because those users can create posts with a title and a little bit of body text
// We created followController because this app allows users to follow each other
// So big picture we know that we have to set up code to manage users, posts and follows, so the idea is that each one of this files or controllers
// Will contain relevant functions for that feature

// Now that we have the basic organization of the router and the controller set up lets look ahead to our next actual task
// It would make a sense to focus on the ability of the visitor to register for an account
// So from here, we go to html template or our views and check to what url the registering form attempts to post to

// As I get it now, for each request no matter which get or post, we add new route and handle that