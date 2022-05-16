// AVOID USING ARROW FUNCTIONS IN MODELS, THEY DON'T WORK HERE, THEY CAUSE BUGS
// So one of the great things about an arrow function is that it doesn't manipulate or change the this keyword
// So whatever the this keyword was set to outside of this function is what it will still be equal
// @TODO I got the sense of why it wasn't working but haven't yet completely realized, gotta find out sometime another

// This going to return the database object so we look inside it with .collection() and choose the collection we want in this file
// To work with, oh wooow, I'm impressed again, omg, I have shivers
// Awesome, now we have this variable usersCollection on which we can perform CRUD operations on
const usersCollection = require('../db').collection("users")
// We will use this package instead of regular expressions to validate the email user types in
const validator = require('validator')
// This function will be our constructor function, this will be reusable blueprint that can be used to create user objects
// In other words we want to be able to leverage this function from within our userController file 
// Here we add parameter data to receive the form field data passed from controller
// Sadly, we cannot use arrow functions for defining constructor functions, that's why I was getting error of undefined
let User = function(data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function() {
  // Here we check if user while submitting username submits anything other than string
  // This way we completely ignore whatever non-string value was attempted to be set
  // Instead we set it to completely safe empty string and from there our other validation rules take care of it
  // It will catch that the username is blank and say that user must provide a username
  // Aand we do same for all other input values as well
  if (typeof(this.data.username) != "string") {this.data.username = ""}
  if (typeof(this.data.email) != "string") {this.data.email = ""}
  if (typeof(this.data.password) != "string") {this.data.password = ""}

  // Now we will set the things up that if req will have any bogus (funny word) properties other than this three: username, email and password
  // We would want to ignore those other properties
  // This way we are cleaning up or purifying our data property, by manually updating the data with properties we actually want
  // Now we will clean it up even further by adding trim method, which will get rid of any empty spaces at the beginning or end of the value
  // Also we add toLowerCase() which turns string chars all to lowercase
  // We do same for email BUT, we do not want to do same for password cuz well we want to respect users wish to add spaces to it
  // Or play with the case :d cuz they both are valid parts of password
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  }
}

// We moved validation of user input here instead of putting it into register method in order to stay organized
User.prototype.validate = function() {
  if (this.data.username == "") {this.errors.push("You must provide a username.")}
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
  // Whatever we pass within isEmail() parenthesis, this isEmail() method will return either true or false
  // In this case we pass the email that user just submitted, so if what users type is valid email address, this is going to return true
  // But we only want to push the following error, if what they typed in is not a valid email, so to check for the opposite
  // Right before the validator, we include exclamation ! mark
  if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
  if (this.data.password == "") {this.errors.push("You must provide a password.")}
  if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters")}
  if (this.data.password.length > 100) {this.errors.push("Password cannot exceed 100 characters.")}
  if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters")}
  if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
  
  // Instead of validating the email with regular expressions we will use npm package for it
  // We will install the validator package with the following command > npm install validator
}
// About the callback paramater in this function, go read in our user model User.js, right where this login method is called
User.prototype.login = function(callback) {
  // This method will check to make sure that the values are strings of text
  // After this, what we want to do is look into database and before we even worry about the password value at all, 
  // We want to focus on a username value, meaning is there even an existing user document with matching username
  // That the visitor just tried login with
  this.cleanUp()
  // This is an object that represents our database collection and we can perform CRUD operations on it
  // In this case we are interested in R in CRUD, which is READ, we want to read or load or lookup data from the database
  // We will call .findOne() method and give it two args
  // For the first arg we give it an object, thats where we tell mongo, what we are trying to find
  // So lets say we are trying to find where username property or field is matching whatever the user just typed in
  // For the second arg we pass function, which will be called, once the first arg operation had had a chance to complete
  // Because we don't know how long it's gonna take for database to perform the find action
  // Brad just made up the name for second arg of function here, technically we can name it anything
  // So the idea here is that, if mongodb does find the user that matches our condition, it's going to pass that document
  // As attemptedUser paramater into our anonym function
  usersCollection.findOne({username: this.data.username}, (err, attemptedUser) => {
    // So we placed that param here as a condition, cuz the function will be called even if mongodb didn't find matching user
    // So we want to check if it did found one and if it did the condition will evaluate to true
    // In this context we gotta make sure that this keyword doesn't come to bite us :d
    // Means that when the .findOne() method calls the callback function, because it's not an object directly calling our function
    // JavaScript is actually going to consider the global object to be what's calling our function, so that's what it is going to set
    // this keyword to, instead of our lowercase user object that we created from our blueprint, luckily there is an easy way to get
    // Around this, instead of providing a traditional anonym function, we can provide an arrow function, omg I'm gonna get now
    // Why arrow functions weren't working here properly, I wrote about it in the beginning of file
    // So if below condition is true, that means that user has typed in correct username and password, it matches something
    // In our existing database
    if (attemptedUser && attemptedUser.password == this.data.password) {
      // We want to send res.send() here, but it's not job of our model to send back response for that route
      // That is the job of our controller
      // We set it up in our controller, so this function will be called after database action is complete
      callback("Congrats!")
    } else {
      callback("Invalid username / password.")
    }
  })
}

// So we won't add a method directly to the blueprint because in that case that function will be duplicated or recreated for each new object
// Alternative way of addming methods to blueprint is below, using this approach javascript won't have to create or add new method for
// Each object every time, instead it will have access to this one created once
// With other words, using this syntax javascript will not need to create copy of this function once for each new object
// Instead any new object created using above constructor function will simply have access to this method
// Within this register function, before we actually register the user, or in other words save the user to the database
// We will first validate their username, email and password values or in other words we will want to enforce all of our business logic

// This is what our userController is going to call, when some1 submits the user registration form
User.prototype.register = function() {
  // Step #1: Validate user data | This is where we check to make sure that none of the fields are empty and also that the values make sense
  // In the name of organization we moved away the validation method and just called it here
  this.cleanUp()
  this.validate()

  // Step #2: Only if there are no validation errors then save the user data into a database
  // We want to permanently store users username email and password so we can later reference it when user tries to login in the future

  // Here we will check if there are any validation errors, with length it will evaluate to true if there are errors so we check opposite of that
  if (!this.errors.length) {
    // If there are no errors we want to add or insert new document into the database collection in this case users
    // Within this parenthesis we want to give an object that we would want to save as a document, in this case we just type following
    // Because with above methodes we've already cleaned up and validated that data, we know that below line is only going to run
    // If there are no validation problems, so that data is safe to store in the database
    usersCollection.insertOne(this.data)
  }

  // Okay we again will create a database and Brad recommended to create separate databases for each new project
  // We go to cloud.mongodb.com
  // Then Browse Collections
  // Then + Create Database
  // We choose database name and for first collection we chose users, cuz we are working on them rn so as I get it for different chunks of data
  // We will have separate collections
  // We typed database name in PascalCase and collection name in lowercase
  // So within this users collection, each document will represent one user
}

// We have to set export to then set up import of it <<< I don't know what the hell this means :d
module.exports = User