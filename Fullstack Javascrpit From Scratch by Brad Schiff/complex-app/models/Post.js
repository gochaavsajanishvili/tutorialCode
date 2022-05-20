// We created a const postsCollection in the top of this file
// And imported the db client, then accessed the database with .db() method and after that we want to say .collection()
// And within parenthesis we specify the name of the collection we want to work with
// So the collection is automatically created in database when we invoke it in code, I mean when we insertOne() or with any other methods
const postsCollection = require('../db').db().collection("posts")
// But we don't need the entire package here, we're just interested in certain constructor function so we add .ObjectId
// Essentially it is a tool within mongodb package and we can pass it a simple string of text and it will return that as special objectId
// object type so now we just need to leverage this back down where we are setting author to this.userid in cleanUp function
const ObjectID = require('mongodb').ObjectId

// This is the constructor function and that's what we want to ultimately export, now when our controller uses this constructor function
// To create an object, remember we are passing along req.body which is going to be a form data, that was just submitted, so lets receive
// That argument with a parameter within our parenthesis here, we will name it data and then within the body of our function lets store
// That data within a property on our object, so we can say this.data equals that incoming req.body data
// Rn we have only one parameter to receive incoming request of req.body and now we will add second parameter to receive the incoming user id,
// We can name it anything we want but we will call it userid
let Post = function(data, userid) {
  this.data = data
  // If there are validation problems, we can just push() the message into this array
  this.errors = []
  // We store the incoming user id here so other methods can access it and we will need to alter our cleanUp function as well
  this.userid = userid
}

// Lets make sure with those methods that both the title and the body values are strings, we would not want to accept an array or an object
// These values must be strings
Post.prototype.cleanUp = function() {
  // So if we are not receiving a string we want to overwrite that value with the empty string
  if (typeof(this.data.title) != "string") {this.data.title = ""}
  if (typeof(this.data.body) != "string") {this.data.body = ""}
  
  // Also lets make sure that user didn't pass along any extra bogus properties in their form data
  // Get rid of any bogus properties, to do that we just manually specify which properties we wanted to have
  // So now if user tried to send along extra properties that we would not want to store in our database
  // We are essentially ignoring them or overwriting them, we are updating what this data should be
  // While we are at it, lets add another property named createdDay, it would be nice to know the date that the post was created on
  // We set that property to new Date(), in javascript there's a builtin blueprint or constructor for date objects, so this will return
  // A date object representing the current time when this code executes, that should be useful piece of data to store in our database
  // For this post, also we will run trim() method to ignore any empty spaces at the beginning or end of the values
  // We also treat this area where we can add on additional properties that weren't necessarily submitted by user
  this.data = {
    title: this.data.title.trim(),
    body: this.data.body.trim(),
    createdDate: new Date(),
    // Within mongodb, it's a best practice to not just store this as a simple string of text, but to actually store it as objectId
    // object type, essentially mongodb has a special way of treating id values and to honor that here's what we can do
    // We will craete const objectID at the top of this file and then change and pass this.userid to ObjectID() and then save it to
    // author, so that will return an id object that mongodb is more than happy with
    // We gotta sign out and sign back in, that way our server has a chance to regenerate a new session for us using that new piece
    // Of session data that we are storing, the id of the current user
    author: ObjectID(this.userid)
  }
}

Post.prototype.validate = function() {
  // This time validation will be easier than with user registration form, because this time all we need to do is just make sure
  // That neither of given fields are blank, we want to force the user to type something into both of the fields
  // Within the curly brackets we would want to add an error message, but before we do that we want to add up in the contructor function
  // We will add an empty array named errors, now if there are validation problems, we can just push() the message into the array
  if (this.data.title == "") {this.errors.push("You must provide a title.")}
  if (this.data.body == "") {this.errors.push("You must provide post content.")}
}

// Here we will create a method that any object created by the given blueprint should have access to
// We've referenced this create method in controller, so we better have a matching name here :d
// Okay and just like we did it in user model, we want to have here methods cleanUp and validate
Post.prototype.create = function() {
  // It's within our create method where we would actually store a document in a database
  // But before we do that, we know that within this create method, we would wanna call cleanUp and validate
  // Also we want this function to return a promise to leverage it from our post controller, also stick it in your mind
  // When we interact with an object and in this case just write the blueprint model of the object, in promises we use arrow
  // functions to don't affect how the this keyword works, well maybe that won't be case always, but with what I know rn, it is
  // Also remember to include two VERY important parameters of resolve and reject
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    // After running above functions to check the inputed values of user, we then check errors array if it is empty or not, means if there were
    // Any errors with input values or not. In the if satement condition it will evaluate to true if array has more than zero items in it
    // So to check the opposite of that we just place an exclamation right before the expression, so now we are essentially saying
    // If that errors array is empty, then this is where we want to store a new document in the database 
    if (!this.errors.length) {
      // Save post into database
      // But this file yet hasn't any access to the database to fix that we created a const postsCollection in the top of this file
      // And imported the db client, then accessed the database with .db() method and after that we want to say .collection()
      // And within parenthesis we specify the name of the collection we want to work with in this case posts
      // Within parenthesis, we just pass an object that we would want to store as a document in the database, in this case
      // That would just be this.data and to complete this promise, right below it, we call resolve()
      // However this insertOne() is async operation, we have no idea how long it's going to take to store that in the database
      // We already know that mongodb methods return promises so we can either use the then().catch() syntax or the async/await
      // Now in a situation where there's more going on and Brad is trying to coordinate multiple things Brad do prefers async/await
      // But in a really simple situation like this, where we are just waiting for the one thing to finish and then we want to do
      // One more thing, Brad actually thinks, .then().catch() feels cleaner, so we remove the resolve under insertOne() and probably
      // Will add it to then()
      postsCollection.insertOne(this.data).then(() => {
        // If mongo was successful in add the document, here we will call resolve
        resolve()
      }).catch(() => {
        // But if mongo runs into an error of some sort we will push error into the array of errors
        // Because if this situation ever happens, the problem has nothing to do with the data that the user just entered
        // And it has everything to do with some sort of server problem or database connection problem, after push()
        // We call reject and pass the array of errors to be able to display the occured error with flash messages to the user
        this.errors.push("Please try again later.")
        reject(this.errors)
      })
    } else {
      // So if code reaches this point, it would mean that there are validation errors, so here we will just want to reject
      // And within parenthesis we can reject with the value of errors
      reject(this.errors)
    }
  })
}

// We know that uppercase Post is a function, on top of this file, that's where we have our constructor function named Post
// So how can we add properties or a function to a function, lets remember that in javascript a function is an object, just like
// Any other object, meaning we can use its namespace or store properties in it by saying .propertyName, this is great because 
// Now within our controller we can leverage uppercase post either as a constructor, from an object oriented perspective or we can
// Just simply call a really simple function on it, now Brad says he didn't invent this strategy of being able to use a function in multiple
// Ways like this, this setup is familiar to those who've ever used popular mongodb object modeling tool named mongoose, within our controller
// We can leverage our mongoose model both to create new objects with it as a blueprint, but we can also call simple functions from it as well
// Within parenthesis, we will receive the incoming id and within the body we want to return a promise
Post.findSingleById = function(id) {
  // Hmm, this time we are not using arrow function, because we are not interacting with this keyword, therefore not altering it
  return new Promise( async function(resolve, reject) {
    // Before we actually try to look any data up in our database lets first make sure that requested id makes sense and isn't malicious
    // If typeof(id) doesn't equal string, meaning if user is trying to send an object or anything that's not just a simple string, that means
    // they could be a malicious user trying to perform an injection attack, in other words, anytime we're going to use user inputted data
    // To build a query in mongodb, we need to make sure that it's just simple string of text and not an object, in second condition
    // We want to make sure that the incoming id is a valid mongodb object id, what is meant here is that, in mongodb the id for a document
    // The unique string of characters, not only does it need to be a certain length but also only certain characters are allowed in there
    // Is if the final segment of our url isn't even a valid mongodb id we don't need to waste a trip to our database, we can just immediately send
    // A page not found message, so we say ObjectID.isValid(id), this would return true if it was a valid id so we will include an exclamation mark
    // At the beginning of this to say if it's not a valid id, so in this if statement we say, if id isn't simple string of text or a valid id
    // Not only we would want to reject this promise, but below that we would also want to return, cuz we want to prevent any further execution
    // Of our function
    if (typeof(id) != "string" || !ObjectID.isValid(id)) {
      reject()
      return
    }
    // If javascript ever gets to this point, that means we have an id value that we are safe to try and look up in our database
    // So we create a variable and name it post and then we can just use a mongodb crud function, so we know that we can work with our collection
    // Of post documents by using our postsCollection variable and lets look inside it for the method named findOne(), within those parenthesis
    // We tell the mongo what we are trying to find, so lets give it an object and we want to find a document, where _id field has a value
    // That matches the incoming requested id from the url, so we create new instance of the mongodb ObjectID and then we pass it requested id
    let post = await postsCollection.findOne({_id: new ObjectID(id)})
    // Here we write one more if statement, where we pass post variable because if above code finds the document, that's where it's gonna
    // Resolve to, but if it doesn't find a document, then essentially that variable is going to be empty so the if condition will not evaluate to
    // True, now we do need to be careful with timing of things, we don't want to execute ifelse, until the READ CRUD operation above has had
    // A chance to actually resolve, now we know that above mongodb method is going to return a promise, so right at the start of it we can say
    // Await, that way javascript will wait for the READ action to complete, before moving on to the next operation, but if we are going to use 
    // Await, we need to be sure that we are inside async function, so we give a parent function an async keyword before it
    if (post) {
      // If we successfully found a post let's just have our promise resolve, with a value of that post document
      resolve(post)
    } else {
      // If there is no post document for that id let's just reject
      reject()
    }
  })
}

module.exports = Post

// Okay so we've successfully submitted the post, means we saved it to the database, 
// Where the title and body and the submition time is present, as well as the id of the post of course, 
// That is added by database for its every document, but also want to save the author of the post or the document
// We want to keep track of which user account created which post documents, so we want another field in database named author
// But we would not want to set its value to users username because in most applications users can change their usernames, so we want it to
// Be something that never changes, so as it seems we gonna use id's for that, that's what we gonna store as the author value within a post
// Document, so to set that up we go to postController file and do changes to create function there
// All done in postController, now we will leverage it here, we go to our construction function where rn we have only one parameter to receive
// Incoming request of req.body and now we will add second parameter to receive the incoming user id, we can name it anything we want but we
// Will call it userid