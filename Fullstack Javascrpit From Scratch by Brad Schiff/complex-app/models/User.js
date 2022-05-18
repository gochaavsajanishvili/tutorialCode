// AVOID USING ARROW FUNCTIONS IN MODELS, THEY DON'T WORK HERE, THEY CAUSE BUGS
// So one of the great things about an arrow function is that it doesn't manipulate or change the this keyword
// So whatever the this keyword was set to outside of this function is what it will still be equal
// @TODO I got the sense of why it wasn't working but haven't yet completely realized, gotta find out sometime another

const bcrypt = require('bcryptjs')

// I don't know how the hell this line of code appeared here but it broke my flow and everything else and
// Made me truly suffer a lot, thanks god I realized to check the Source control tab to see what changes I've
// Made and there I've discovered this line, which really doesn't make sense at all to me 
// const { Promise } = require('mongodb')

// This going to return the database object so we look inside it with .collection() and choose the collection we want in this file
// To work with, oh wooow, I'm impressed again, omg, I have shivers
// Awesome, now we have this variable usersCollection on which we can perform CRUD operations on

// Now since the db.js is exporting a client instead of database we have to fix this, we will add .db()
// before the .collection(), as easy as that
const usersCollection = require('../db').db().collection("users")
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

// Now we will transform this into promise to make sure that this code completes before moving on the next one
User.prototype.validate = function() {
  // Within parenthesis of a Promise(), we just need to give a function with two params, resolve and reject
  // Also we will convert this function to arrow function so the this keyword won't be affected
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "") {this.errors.push("You must provide a username.")}
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
    // Whatever we pass within isEmail() parenthesis, this isEmail() method will return either true or false
    // In this case we pass the email that user just submitted, so if what users type is valid email address, this is going to return true
    // But we only want to push the following error, if what they typed in is not a valid email, so to check for the opposite
    // Right before the validator, we include exclamation ! mark
    if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
    if (this.data.password == "") {this.errors.push("You must provide a password.")}
    if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters")}
    // Because bcrypt had a max limit value in the past and may not have now, we still change the max value to 50 in any case
    if (this.data.password.length > 50) {this.errors.push("Password cannot exceed 50 characters.")}
    if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters")}
    if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
    
    // Instead of validating the email with regular expressions we will use npm package for it
    // We will install the validator package with the following command > npm install validator
  
    // Only if the username is valid, then check to see if it's already taken, no point in wasting our trip to database to see if username
    // Exists already, if its not even a valid username, obviously if it's never met our validation checks then it would have never ended up in the
    // Database in the first place and anytime we can save the unnecessary trip to the database, is great for performance
    if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
      // In the object as first arg to findOne() we tell mongodb what we are trying to find, we want to find first document where username
      // Field or property matches whatever the user just tried to register with, the idea is that if findOne() finds in database
      // What user has just typed in, then it will resolve with an object, means it will return that document object, but if it didn't find anything
      // findOne() method will resolve to null, so the if statement won't work on null but will work on any sort of object, that means if user exists
      // The error will be added to errors array but if it not, then nothing will be added to the array
      // So here is the thing, this findOne() method has to communicate with database, that means that it for sure will take some time
      // And will not be completed till the next line runs, we have to time it in a way that next line if statement won't run till
      // The variable usernameExists gets value, we will do it using promise, as mognodb package is relatively modern, findOne() method
      // returns promise, so we can tell it to await, that means, freeze javascript program, until the given action is completed and when it
      // Happens, only then check the following if statement
      // like wooow, I don't know why javascript gets so much hate, it is truly beautiful, it really is, I'm touched and shocked and amazed <3
      // However, the await feature is only available only within asynchronous function, so the function this code lives within is 
      // User.prototype.validate and right before the anonym function which we pass to it we will write async
      let usernameExists = await usersCollection.findOne({username: this.data.username})
      if (usernameExists) {this.errors.push("That username is already taken.")}
    }
  
    // Only if the email is valid, then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({email: this.data.email})
      if (emailExists) {this.errors.push("That email has already been used.")}
    }
    // We call resolve() to signify that this operation or promise has actually completed
    resolve()
  })
}

// About the callback paramater in this function, go read in our user model User.js, right where this login method is called

// We will now delete the callback param here cuz we are transforming this traditional callback function into new promise
// Practice
User.prototype.login = function() {
  // When we call this login function from userController, this function is going to return a new object that is a promise
  // Now when we create promise like this within it's parenthesis we want to pass it a function
  // So to this anonym function we need to give two params, technically we can name it anything but the industry standard is resolve and reject
  return new Promise((resolve, reject) => {
    // Here we can perform async operations or operations that are going to take some time to complete
    // And whenever those actions are complete, we just call resolve or reject, that's how we let js know
    // That this promise either completed in the case of resolve or had a chance to fail in the case of reject
    // Okay one thing is left till we be able to use promise is we should change anonym function to arrow function which we pass to promise
    // So it won't manipulate the this keyword (god I wish i understand it perfect, hope soon I will)
    
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

    // Since we started using promises we will now replace this traditional callback approach as well
    // Cuz mongodb package is very modern, it not only allows us to use traditional callback but also will return a promise
    // Brad says that almost all mongodb methods return promises
    // Now because we know that this method returns promise, we can call .then() and .catch() on it
    usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
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

      // Okay, now that we are hashing our passwords, this won't work anymore, so we gotta change it, we delete
      // attemptedUser.password == this.data.password part which was after AND operator and now we gonna use
      // bcrypt package, in compareSync() method we give it two args, first is gonna be a password that user just typed in
      // That will be something that is not already hashed and the second value will be the hashed value from the database
      if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
        // We want to send res.send() here, but it's not job of our model to send back response for that route
        // That is the job of our controller
        // We set it up in our controller, so this function will be called after database action is complete

        // Here to replace old traditional way of callback to modern promise we change this callback function to resolve
        // That's if login was successfull otherwise check else
        resolve("Congrats!")
      } else {
        // Otherwise we use reject instead of old, traditional callback function
        reject("Invalid username / password.")
      }
    }).catch(function() {
      // This error is thrown not because of user, but because of we devs made some mistake
      reject("Please try again later.")
    })
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

// This is where we gonna hash our passwords, seems pretty obvious isn't it? :d
// But before that we need to install package for it from NPM so the command for it is > npm install bcryptjs
// It is very popular hashing package in the js world
// We will require it in the start of the file
// There is no sense wasting our servers processing power converting a password into a hash unless there is no validation errors
// With the user's inputed data, so that's why we will dive into our if statement

// Now we have one more final issue to hurdle before this asynchroning the validate() function completes
// So now that we made the register anonym function async, we need to pay attention, where and how we are calling it
// This register function is called in our userController
User.prototype.register = function() {
  return new Promise(async (resolve, reject) => {
    // Step #1: Validate user data | This is where we check to make sure that none of the fields are empty and also that the values make sense
    // In the name of organization we moved away the validation method and just called it here
    this.cleanUp()
    // Now as we made this function async, we have to be very careful to make sure that it actually completes before javascript would move on
    // To next action, before we check to see if there are errors or not, we better first complete running all of our validation checks
    // Including those async calls to the database to check for the uniqueness of username and email
    // So to accomplish that lets just go adjust our validate function to return a promise and then we can await that promise 
    // Down here in the registration function
    // So we turned this validate() function into Promise and can add await to it so all of the following code will wait before this action
    // Completes, now again, as we only can use await inside an async function, we will add async to parent function
    await this.validate()
  
    // Step #2: Only if there are no validation errors then save the user data into a database
    // We want to permanently store users username email and password so we can later reference it when user tries to login in the future
  
    // Here we will check if there are any validation errors, with length it will evaluate to true if there are errors so we check opposite of that
    if (!this.errors.length) {
      // Hash user password
      // Using bcrypt is a two step process, so first we want to create something called a salt
      // I have no idea what this salt thing is but Brad says that once we've generated the salt, now we can generate the hash
      let salt = bcrypt.genSaltSync(10)
      // Now we want to overwrite user's password value
      // We give this hashSync() method two args, the first arg is a value that I wanna hash, so it will be a data user just typed in
      // And the second arg will be our salt value, now we are good to go, I guess this salt thing is into how many charactered hash
      // Will users password converted, but lets see how it will go, cuz this.data is what is stored into database and we just updated
      // The password value of that data
      // Okay no, salt doesn't means number of characters in the hash version of users pass :d k @TODO find out what is salt
      this.data.password = bcrypt.hashSync(this.data.password, salt)
      // If there are no errors we want to add or insert new document into the database collection in this case users
      // Within this parenthesis we want to give an object that we would want to save as a document, in this case we just type following
      // Because with above methodes we've already cleaned up and validated that data, we know that below line is only going to run
      // If there are no validation problems, so that data is safe to store in the database

      // We have to make sure that this database action completes before we call resolve() so we include await, because we know
      // That mongodb methods return a promise
      await usersCollection.insertOne(this.data)
      // So we called resolve() after the validation was successful and the registration completed and we will call reject() if there were errors
      resolve()
    } else {
      // And why don't we reject() with our array of errors
      reject(this.errors)
    }
  
    // Okay we again will create a database and Brad recommended to create separate databases for each new project
    // We go to cloud.mongodb.com
    // Then Browse Collections
    // Then + Create Database
    // We choose database name and for first collection we chose users, cuz we are working on them rn so as I get it for different chunks of data
    // We will have separate collections
    // We typed database name in PascalCase and collection name in lowercase
    // So within this users collection, each document will represent one user
  })
}

// We have to set export to then set up import of it <<< I don't know what the hell this means :d
module.exports = User