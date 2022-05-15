// This is where we will use express framework to create a server that listens for incoming requests
// As we did in previous app we need to go to javascript grocery store or npm - node package manager and pick up express
// But before we install any packages, we should create package.json file which will act as our recipe list or ingredients list
// We do it with following command > npm init -y
// package.json file will keep track of all of the packages that our app needs
// Okay now we can install express with following command > npm install express
// Now we can use express
// We now declare variables which we shouldn't ever change as const to prevent bugs
const express = require('express')
// After importing express we turn it on with following code
const app = express()

// Here we require our newly created router.js file, we type ./ which means to look inside our current folder or directory and viola, the console.log()
// Is executed immediately, that means that we successfully executed code from a separate file
// Also, in case of packages we just type name, but when we import our files, we need to specify the path which points to chosen file 
// We can also give the extension here but it's not required
// require() function does two things, number one, it executes the file, number two, it also returns, whatever that file exports
// That's why we wrote module.exports there, nodejs knows what does it mean, it's under lookout for that special variable
// And whatever it will be set equal to, will be returned whenever we require the file in
// So when we require the file, it will be executed immediately and whatever we export, that will be stored in a given variable
// And we can use it, wherever and whenever we see fit
// We can export any data type, the variable where we save export of required file literally equals to the contents of what was exported
const router = require('./router')

// Here we tell express to make the public folder accessible here
app.use(express.static('public'))
// Here we configure our express application to be able to render views from views folder
// First arg is where we set the configuration option, in this case to views
// Second arg is where we provide the name of the folder where our views reside
// First arg need to be exactly views, it's an express option and second arg is based on our folder name 
app.set('views', 'views')
// Now we will tell express which templating engine or templating system we are using
// Here in second arg we tell express which engine we are using
// We have many different options to choose from, in javascript community, like pug or handlebars or ejs
// So it's obvious now that we are gonna use ejs here, that's why we set extension of our template to .ejs
// Each different template engine has its own syntax and features
// Now if we are telling express here, that we want to use ejs engine, we have to install it from npm as well
// We do it with following command > npm install ejs
app.set('view engine', 'ejs')

// Now we will tell our app what it should do if it receives a get request to the base url
// I will try using arrow functions instead of anonym functions here, it's time to get bolder after 8+ hours in tutorial :d
// We no longer need this chunk of code because we will now be exporting it from new routers file that we've just set up
// And btw arrow functions work like piece of cake
/*
app.get('/', (req, res) => {
  // From here we want to render the template, to do that we have to configure our express application a bit
  // After configuring it and specifying the template engine that we will use, instead of using res.send(`htmlCodeHere`) we will now use
  // res.render(), where within parenthesis of the render() method, we just give a name of a template or a view in this case home-guest
  // We do not need to include .ejs there when referencing the template
  res.render('home-guest')
})
*/

// Here we tell to our overall express application to use the that new router that we set up
// For first arg we tell it which url to use this router for, in this case we want overall or the base router
// For the second arg we write the router we want to use, so we just say router because that is the name of the variable
// That imports our file, that will be what that file is exporting
// console.log(router)
// So we declare here the listening for the base url but as I get it, for other urls we don't need to declare it here, we will
// Specify or list them in routers file, this was just the starting point and we needed to export router variable from router.js
// To make it usable here
app.use('/', router)

// Now we will tell our app to begin listening to incoming requests
app.listen(3000)

// In the name of repetition I write here that following cmd code launchs our app, after node we type the name of the main file > node app

// In the name of organization we will no longer paste html templates directly into this main file
// Instead we will create views folder which will contain all html templates or as Brad empasized - views
// @Ah-a So now I understand what in MVC views are
// Inside the views folder we create template files with the extension of .ejs

// We succussfully connected our views with our app but we do miss a little bit of css in the home-guest, it seems that custom css is needed to make
// It look exactly like we want to, to do that we create subfolder within our main folder, named public, this is the file where we will keep our
// CSS files or browser based javascript files, that we want to be accessible by anyone who views our app
// Now that we created the public folder, we want to tell express to make that folder available
// After adding css to public folder, we want to include forward slash / in href which links to that css file to make it available for template

// Finally Brad will add nodemon again, got sick of this manual restarts already :d
// In the name of repetition the code to install nodemon is > npm install nodemon
// Then as I remember it correctly, we go to package.json and in scripts object property we add new property with whatever name we want
// But with Brad I choose "watch" and then we specify which file we want to be watched by nodemon, so like this "watch": "app.js"
// Na, it seems that correct version of the code is "watch": "nodemon app", well at least I remembered some part of it :d (excluding the fact
// that we have to go to package.json, after Brad said it, thats when my memory got triggered)

// It seems that in following tutorial we will move routes to separate file as well, as their number grows to make them
// Easier to manage, we don't want to clutter up this main app.js file, (even though it already is, cuz of my comments :d)
// With larger projects organization becomes more and more important, so we want to start creating separate files with distinct responsibilities
// With that in mind we will now learn how to create something that is named router, setting up a router, is essential part of staying organized
// A router has the responsibility of listing out the urls or routes that you want to listen for and then say what should happen for each of this routes
// So anytime we're writting app.get() or app.post(), we are defining a route, so we want to keep all of those, within a router, the idea is to stay
// Organized, so we keep all of our routes in a separate file and that's the only responsibility of that file, it's just the router
// So we create new file in the root of our project folder, named router.js, technically we can name it anything though

// Before we learn how to set routes we want to learn how we let one javascript file communicate with another, or let one js file share code with another
// It's just a basic nodejs skill of how to share code from one file to another, cuz we want to write code in our router.js and then leverage it in app.js
// We know that we can use require() to load in or import in or require a package, so we know that we can use require() with packages we didn't create
// But we can also use require() to pull in javascript files that we did create

// We cannot trust visitors to enter valid information into given form, on the server side we need to make sure they not leave any of the fields blank
// We need to make sure their password contains enough characters for security reasons, we need to make sure they've entered valid email address
// We need to make sure their username doesn't contain any weird or strange characters, we need to make sure both username and email are unique
// and not already in use and etc
// In the name staying organized we don't want to include all of that business logic and data modeling in our controller, instead we want to keep 
// The code that enforces all of the rules described above, in a separate file, so the controller doesn't become bloated

// In model we include all of the business logic, or all of the rules that we want to enforce on our data
// For example:
// Users username must be unique
// The password must be at least 12 characters long and etc.
// Essentially the model is where we model our data

// Views is our html template or view file, it's just html that users will see in their web browser

// It's the responsibility of controller to accept input, in this case network requests to our different routes
// And the controller needs to convert that input into appropriate commands for our models and views so controller is something like middleman
// Depending on icoming request, the controller will call appropriate model with the appropriate business logic and rules that we want to enforce
// On the data and once that's done the controller will call appropriate view and pass it any relevant dynamic data from the model