// This is all we need to do to easily import the environment variables from .env file to our chosen file
const dotenv = require('dotenv')
// As soon as we run config here that package is going to load in all of the values that we defined within our .env file
// It knows to specifically look for a file .env and it's going to take care of the rest
dotenv.config()
// Here we will open the connection to database but in order to do that we need to go to NPM
// And grab the mongodb package from there I guess the command will be > npm install mongodb, yep I was right
// Now we have to require that package, damn when I will remember all this
// Aaand here we go again to establish connection we need this MongoClient class to be added manually
const mongodb = require('mongodb').MongoClient

// Check TodoApp to refresh your memory about how to get and configure this connection string
// Hint, you press Connect button on mongodb atlas dashboard

// We want this to be different value, depending on a current environment
// This is exactly when environment variables come into play
// Also this string exposes our database username and password if we upload this file to for example github
// So we wanna hide that

// Here we open the connection to database, within parenthesis we give three arguments
// Lets see if arrow functions will work here
// Brad said second arg will not we necessary in the future when the new mongodb package comes out
// @TODO check if that future came
// Repetition: first arg is a string of text that tells mongodb where and what we want to connect to
// So now here after implementing environmental variables we change first arg of connectionString const to the following
// process.env.CONNECTIONSTRING, in the nodejs environment this is how we access environment variables
mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  // This will return the actual database object that we can work with, Brad highlighted .db() method when was saying that
  // From there we can then find the collection and then we can perform CRUD operations to CREATE, READ, UPDATE, DELETE database documents
  // After saving the database object to module.exports, if we require this file withing another file, it's going to return the database
  // That we can work with 
  module.exports = client.db()
  // Now express application isn't going to begin before the connection with database is established
  // With Brads words, it's not going to begin until we've already had a chance to export the mongodb database
  // This means that we can now very easily access and work with our database from within any file where we just require in this db.js file
  // This setup is perfect for our MVC setup
  const app = require('./app')
  // We've changed hard coded port 3000 to this environment variable because we want to make it dynamic, cuz different environments
  // For example heroku might require different port numbers
  app.listen(process.env.PORT)
})

// We gonna make this db.js file our first or starting file, because we don't want to launch or begin our application until
// We've had a chance to establish a connection to our database, because we don't know how long it's going to take
// To create the connection to the database, the third arg function won't going to run before we have that connection
// So we want to start our express app right below the module.exports = client.db() line
// To do that we delete the app.listen(3000) and in app.js and intead of it add module.exports = app
// Okay and after changing the first file we need to change it in package.js watch property too for nodemon you know
// Also if nodemon was running while doing this changes, we need to re-run it npm run watch so for changes to apply

// So about environment variables, we create in a root of our project directory, file named .env
// I guess that .env won't be uploaded to github so I will write instructions here
// Within that empty .env file we can create environment variables, we can name them whatever we want
// But in the porgramming world it is a common convention to name them with all CAPITAL letters
// We typed there CONNECTIONSTRING, now in that file we do not use javascript syntax so we don't even
// Include a space after the name, so we say CONNECTIONSTRING= and we don't include quotes for a string
// Of text, we simply start typing string of text, now we will move our connectionString to there
// So it won't appear in this file anymore, bye bye connection string!
// Wow we're gonna delete entire line of connection string including the const declaration
// So into .connect() method instead of connectionString const we want to pull in our new
// Environment variable, in order to easily load environment variable from our .env file we're going to want to go
// To our javascript grocery store or NPM and pick up a package the package will be dotenv and command is > npm install dotenv
// We will require it in the top of this file, btw arrow functions do work here! yeey!
// One of the reasons why this setup is desirable is now it's super easy for my application to change and adjust depending
// On the current environment, for example, current values are great for when we are working on local development copy
// And then when we finish our application and are ready to push it up to Heroku, well we will ust not push our .env file up to heroku
// Instead process.env.PORT will pull in whatever the environment variable they've already set port to be within Heroku environment
// And we can just manually create environment variable named CONNECTIONSTRING within our heroku account, so this way
// I manage my individual variables, instead of having to change the my actual code, this way my important values are not hard coded
// Now I can keep all sorts of things within my .env file, for example any secret ip keys that I am using to connect to third party apps
// They can go in .env and when I push my code to heroku I just manually add this environment variables and I can set up them within Heroku
// Dashboard or with a simple commandline commands 