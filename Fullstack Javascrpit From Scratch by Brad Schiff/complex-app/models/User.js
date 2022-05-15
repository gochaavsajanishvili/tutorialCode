// AVOID USING ARROW FUNCTIONS IN MODELS, THEY DON'T WORK HERE, THEY CAUSE BUGS

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

// So we won't add a method directly to the blueprint because in that case that function will be duplicated or recreated for each new object
// Alternative way of addming methods to blueprint is below, using this approach javascript won't have to create or add new method for
// Each object every time, instead it will have access to this one created once
// With other words, using this syntax javascript will not need to create copy of this function once for each new object
// Instead any new object created using above constructor function will simply have access to this method
// Within this register function, before we actually register the user, or in other words save the user to the database
// We will first validate their username, email and password values or in other words we will want to enforce all of our business logic
User.prototype.register = function() {
  // Step #1: Validate user data | This is where we check to make sure that none of the fields are empty and also that the values make sense
  // In the name of organization we moved away the validation method and just called it here
  this.validate()
  // Step #2: Only if there are no validation errors then save the user data into a database
  // We want to permanently store users username email and password so we can later reference it when user tries to login in the future
}

// We have to set export to then set up import of it
module.exports = User