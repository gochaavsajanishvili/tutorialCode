// Here we will open the connection to database but in order to do that we need to go to NPM
// And grab the mongodb package from there I guess the command will be > npm install mongodb, yep I was right
// Now we have to require that package, damn when I will remember all this
// Aaand here we go again to establish connection we need this MongoClient class to be added manually
const mongodb = require('mongodb').MongoClient

// Check TodoApp to refresh your memory about how to get and configure this connection string
// Hint, you press Connect button on mongodb atlas dashboard
const connectionString = 'mongodb+srv://todoAppUser:123asdASD@cluster0.gurzr.mongodb.net/ComplexApp?retryWrites=true&w=majority'

// Here we open the connection to database, within parenthesis we give three arguments
// Lets see if arrow functions will work here
// Brad said second arg will not we necessary in the future when the new mongodb package comes out
// @TODO check if that future came
// Repetition: first arg is a string of text that tells mongodb where and what we want to connect to
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
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
  app.listen(3000)
})

// We gonna make this db.js file our first or starting file, because we don't want to launch or begin our application until
// We've had a chance to establish a connection to our database, because we don't know how long it's going to take
// To create the connection to the database, the third arg function won't going to run before we have that connection
// So we want to start our express app right below the module.exports = client.db() line
// To do that we delete the app.listen(3000) and in app.js and intead of it add module.exports = app
// Okay and after changing the first file we need to change it in package.js watch property too for nodemon you know
// Also if nodemon was running while doing this changes, we need to re-run it npm run watch so for changes to apply