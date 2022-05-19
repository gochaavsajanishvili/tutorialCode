// This is where we will use express framework to create a server that listens for incoming requests
// As we did in previous app we need to go to javascript grocery store or npm - node package manager and pick up express
// But before we install any packages, we should create package.json file which will act as our recipe list or ingredients list
// We do it with following command > npm init -y
// package.json file will keep track of all of the packages that our app needs
// Okay now we can install express with following command > npm install express
// Now we can use express
// We now declare variables which we shouldn't ever change as const to prevent bugs
const express = require('express')
const session = require('express-session')
// We capitalized M here, because it's actually a blueprint, that we're going to use to create new object'
// @TODO find out how is it possible to chain parenthesis
// This session is referencing the above express-session package
// This is the old way and deprecated not working anymore so we remove the (session) and modify sessionOptions
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
// After importing express we turn it on with following code
const app = express()

// We need to spell out a few configuration options for how we want to use sessions, lets create variable, we can call it anything but Brad uses
// Following name, so here we leverage that package, within parenthesis we want to provide an object
// Now we provide a few different properties or options

// After we install the mongo package to store there sessions we will have to modify below session options until it's a store session data
// Within mongodb
let sessionOptions = session({
  // No matter what we include here it just has to be something that someone couldn't guess
  // Brad said, these are just boring configuration options that are not worth memorizing
  // It's just boilerplate configuration code that we would only ever need to write once and then just reference again for future projects
  // This completes our configuration or settings to enable sessions

  secret: "JavaScript is soooooooo coool",
  // By default this session package will store session data in memory, but we can override that default with this option store here
  // Within parenthesis of this MongoStore we need to pass in object and we only need this object to have one property client
  // And there we provide a mongodb client, luckily for us we've already setup standalone reusable file that connects to our database
  // We mean db.js so we will just import it right here, bad news is it's currently set up to export a database not a mongodb client
  // But it's easy to fix, we've removed in db.js from module.exports = client.db() the .db()
  // Since we changed what our db exports, we also wanna update our model

  // So here we removed the new keyword and added the .create() method it is newer way and fixed our issue
  store: MongoStore.create({client: require('./db')}),
  resave: false,
  saveUninitialized: false,
  // We set cookie to object because it should have several subproperties
  // maxAge property is how long the cookie for a session should be valid before it expires, it is measured in milliseconds
  // So to calculate it we could write following 1000 * 60 * 60 * 24 <<< this represents one day, milliseconds * seconds * minutes *  hours
  
  // With cookies server is identifying unique web browser or visitor or request
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})

// Now we will tell express to actually use sessions, cool, now our express app supports sessions
app.use(sessionOptions)
// At this point we've added flash feature to our application
app.use(flash())

app.use(function(req, res, next) {
  // We are now working with an object that will be available from within our ejs templates
  // So we can add any objects or properties we want on to this locals object
  // So altogether when we say app.use() we are telling express to run this function for every request
  // And because we are including this before our router, that means this will run first and then since we are calling next()
  // Express will move on to run an actual relevant functions for particular route
  // But big picture, this means that we now have access to a user property (res.locals.user) from within any of our ejs templates
  // We will now remove duplicated code where we are passing session data to a template, first in userController and then postController
  // After that we update the templates to pull from this new user object (res.locals.user)
  // So we just added user. before the properties in templates, not so hard to remember but
  // I struggle to grasp the whole process a bit
  res.locals.user = req.session.user
  next()
})

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

// This tells express to add user submitted data onto our req object so we can then access it from req.body
// So now our application accepts the two most common ways of submitting data on the web
// A traditional html form submit
app.use(express.urlencoded({extended: false}))
// And also just sending over a bit of json data
app.use(express.json())

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
// app.listen(3000)
// We commented out app.listen(3000) and added this line below cuz we are making db.js the first file to start with
// This way we still are creating our express application under this variable app but instead but instead telling it
// To actually start listening, we just exporting it from this file and I guess we will add listening line to db.js
module.exports = app

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

// Before we create user model file that says what a user should be, lets sure first make sure that our user controller can successfully access
// The form data that gets submitted, so now we gonna configure the express app so we can easily access user's submitted data

// Model is where we define the structure of our data, for our user data, we will describe what a user should be
// From programming or javascript perspective, what would a model be? There are many different ways we can set up a model
// But if we really think about it when we ask ourselves what should user be, we are probably going to answer that question by using
// Nouns and verbs and you know what lines up nicely with nouns and verbs in a javascript world? An object
// Just like nouns and verbs an object has properties and methods

// Now in a model we in this case our user model we don't want to create an object as much as we want to create a blueprint or a cookie cutter
// Mold for an object, we can achieve that by using constructor function, we can set up a constructor function that spells out all of the properties
// And methods that a user object should have and we can keep that constructor function in a separate file that will be our user model
// Then within our user controller we can simply import or require in that model file and use it as a blueprint to create a new user object
// Specific to the current request and user submitted data

// All of the logic that checks the incoming data for validaton errors and all of the code that makes up a blueprint of what a user should be
// That will leave in a separate user model file

// In the root folder we create new subfolder named models and in the models folder we create files with first letter uppercase for example for user model
// We will create User.js

// Okay so we will create a separate file for a database connection which will be responsible only for that, so then we can reuse it everywhere
// The file will be db.js

// app.js is our top level file, where we are requiring the express framework, we are enabling different features, we are setting the directory
// For our views and etc. 
// For detailed intro comment about sessions and tokens, visit db.js
// Here in this file we will enable sessions as well

// ====== Flash Messages ======
// Okay so to implement flash messages the first thing we have to do is install the package
// The command for it is > npm install connect-flash
// Yeey, I guessed that we will work in this file and started typing those instructions here <3
// I guess I will have to start writting titles for those instructions to easly navigate through them in future
// I will start with this one, I will invent my own titles or just use the names of videos
// Okay just to be clear, each time we install a package, to use it, we have to then require it!
// Stick this to mind, remember it, do it finally!