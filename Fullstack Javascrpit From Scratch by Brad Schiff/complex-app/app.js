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
app.get('/', (req, res) => {
  // From here we want to render the template, to do that we have to configure our express application a bit
  // After configuring it and specifying the template engine that we will use, instead of using res.send(`htmlCodeHere`) we will now use
  // res.render(), where within parenthesis of the render() method, we just give a name of a template or a view in this case home-guest
  // We do not need to include .ejs there when referencing the template
  res.render('home-guest')
})

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