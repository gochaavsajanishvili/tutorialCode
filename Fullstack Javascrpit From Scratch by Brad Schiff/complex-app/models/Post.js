// We created a const postsCollection in the top of this file
// And imported the db client, then accessed the database with .db() method and after that we want to say .collection()
// And within parenthesis we specify the name of the collection we want to work with
// So the collection is automatically created in database when we invoke it in code, I mean when we insertOne() or with any other methods
const postsCollection = require('../db').db().collection("posts")
// But we don't need the entire package here, we're just interested in certain constructor function so we add .ObjectId
// Essentially it is a tool within mongodb package and we can pass it a simple string of text and it will return that as special objectId
// object type so now we just need to leverage this back down where we are setting author to this.userid in cleanUp function
const ObjectID = require('mongodb').ObjectId
const User = require('./User')

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

// As we want to make this function reusable for the below two functions, we want to adjust the way we work with the aggregate options
// We pass the array param uniqueOperations within parenthesis of this function
Post.reusablePostQuery = function(uniqueOperations) {
  return new Promise(async function(resolve, reject) {
    // We set the aggregate operations variable to whatever array of operations was passed into this function and then we can use an
    // Array method which every array in javascript has named .concat(), it is going to return new array and whatever we give it into its
    // Parenthesis it's going to add that onto the original array, so we will move all of the previous aggregate operations within it's
    // Parenthesis
    let aggOperations = uniqueOperations.concat([
      {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
      {$project: {
        title: 1,
        body: 1,
        createdDate: 1,
        author: {$arrayElemAt: ["authorDocument", 0]}
      }}
    ])

    // Now here after moving up from aggregate it's operations array to above concat() array method within it's parenthesis we will add
    // aggOperations array, because that's going to take only unique parts and add on the shared or common parts, woow, will I ever be able
    // To make my code this DRY?
    let posts = await postsCollection.aggregate(aggOperations).toArray()

    posts = posts.map(function(post) {
      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar
      }

      return post
    })

    resolve(posts)
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

    // All we need to include within those parenthesis is the one part of the query that's unique, so we give it an array of aggregate operations
    // In this case we only need one operation the match operation 
    let posts = await Post.reusablePostQuery([
      // Each operation is an object, we will match it based on the field we are interested in
      {$match: {_id: new ObjectID(id)}}
    ])

    // If javascript ever gets to this point, that means we have an id value that we are safe to try and look up in our database
    // So we create a variable and name it post and then we can just use a mongodb crud function, so we know that we can work with our collection
    // Of post documents by using our postsCollection variable and lets look inside it for the method named findOne(), within those parenthesis
    // We tell the mongo what we are trying to find, so lets give it an object and we want to find a document, where _id field has a value
    // That matches the incoming requested id from the url, so we create new instance of the mongodb ObjectID and then we pass it requested id

    // To get the author and gravatar of author user to the post, we need to do something a bit more complex than just findOne()
    // Hmm we deleted the part of the code but I will leave it here for future reference findOne({_id: new ObjectID(id)})
    // Now instead of calling findOne() we want to call something called aggregate(), this method is great when we need to perform complex or
    // Multiple operations, now aggregate is going to return data that makes sense from a mongodb perspective but maybe not just from a plain
    // JavaScript perspective, so after the aggregate we wanna be sure to call .toArray(), now in this case we are interested in only a single
    // Post but that's just the way .toArray() works, it's going to return array even if that array only contains one item
    // Because we are only interested in the first item in the array, our instinct might be to include square brackets after
    // .toArray() and say zero [0], however we don't wanna do that, ultimately we need this line of code to return a promise, because talking
    // To the database is async operation and ultimately toArray() here is what's going to return a promise so we want to end the 
    // Statement with that, also we want to change post to posts, because it's going to be an array of posts
    // Now how does aggregate() work? aggregate() lets us run multiple operations so within its parenthesis we give it an array
    // So we are passing an aggregate an array, but an array of what? Well, an array of database operations, each operation is an object
    // For first operation we perform a match, so $match will tell mongodb, that that's what we wanna do, then we include an object
    // And this is basically describing documents that we want to match with, so we're interested in a document, where _id matches the incoming
    // Or requested id for this route or coming from our controller, that's our first operation, we are performing a match by the requested id
    // Now we'll perform our second operation, so we use objects to do that as it seems, okay so currently we are within the postsCollection
    // But what we wanted to do here is to look up documents from another collection, our ultimate goal here is to pull in the relevant user
    // Account document so that we can access its username and email for gravatars, so within this object for $lookup, we're going to give
    // Few different properties, first will be a property named from: and we set it to a value of "users", meaning the users collection,
    // So again, we are currently in a posts collection and now we are saying that the document we want to lookup should be pulled from
    // Users collection, as a second property we include localField: "author", so this is saying, when we are looking in the users collection
    // For matching documents, the localField or the field from within the current post item, that we wanna perform that match on is the 
    // Author field, thats what contains the id of the matching user, after this we include another property named foreignField:"_id"
    // So local means the current collection, that's the post collection in this case and foreign means other collection, that we're trying
    // To lookup within, the fields in those documents we want to perform the lookup or match on is the _id field, after that we include
    // Property as: "" we could write/make up within quotes any name we want, but we will choose authorDocument, mongodb will use this name
    // When it adds on a virtual field or property with the matching user document to this post, I got everything except as property
    // But Brad said it's okay, we will visualize it later on and it will be much clearer, I'm gonna trust him on this one aand
    // I wasn't bamboozeled, I really understood it now, so to authorDocument the whole matching document was added with all of its
    // Properties, so the lookup operation is adding this new property to the returned object and it's an array of any matching documents
    // Based on that lookup, it's an array of any user documents thats id matches this author id, now lets keep in mind that our aggregate()
    // Operations aren't actually manipulating any data in the database, it's simply returning data that we can use however we want
    // In this case we know that we want to use this data within our controller and ultimately our controller is just passing it on to an
    // html or ejs template, what Brad is getting at is, that in case of html template, we don't need that to know the author id
    // Instead we'd really just want the author property to be an object that contains the username and gravatar
    // So our first step in order for that to happen is to use another aggregate operator named $project
    // So right now we just have two items in our array of aggregate operations, so lets add third named $project
    // So what $project does, is it to allow us to spell out exactly what fields we want the resulting object to have, this way, instead of
    // Returning every single field for that document we have a bit of fine grain control on what we return
    // So we know that we want to return the title of the post so we write title: 1, 1 means here true or yes do include it
    // We do same for the following fields except for the author field, there we don't wanna just say 1, because that would just be what's
    // Already stored in our post document, just a reference to the matching user id, instead we would want the user property to be that
    // Author document, or the entire user document instead of just the id, so instead of 1 there, we can include an object and
    // $arrayElemAt: ["$authorDocument", 0], now lets unpack this:
    // So for this data that's ultimately going to get passed into our html template, we would want the author property to be an object
    // With the user's username and the gravatar, so that's what we are setting it to with the authorDocument, that's the document
    // That was found during the lookup, so mongodb will see the dollar sign there as the first letter of authorDocument and know
    // That we don't just mean a simple string of text, this means to actually pull in that author document and remember that $lookup
    // Is ultimately going to return an array, but because we know that there's only ever going to be one author document, we're just
    // Returning the first item in that array, so we are interested in array element at 0 position, so this way author will not be an array
    // It will be just that one single object representing that user, oh god, I can't believe I understand all this
    // Okay now the author property, instead of just user id is an object and it contains useful things like username and email address
    // That we can use to pull in the gravatar, however we don't need to pass this entire document to the controller, we would not want
    // To include the password field there so we clean up author property below the line .toArray()
    
    // I multiline commented this code because we made this code reusable
    /*
    let posts = await postsCollection.aggregate([
      {$match: {_id: new ObjectID(id)}},
      {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
      {$project: {
        title: 1,
        body: 1,
        createdDate: 1,
        author: {$arrayElemAt: ["$authorDocument", 0]}
      }}
    ]).toArray()

    // Clean up author property in each post object
    // Ultimately we know that we're going to have variable posts and it's going to be an array, in this case it's only going to contain
    // Only one post, but let's write reusable code that we can leverage in the future, because we know that there will be other times
    // Where we do want to pullin multiple posts, for example a user's home page feed or search results or user's profile
    // So we are going work with our array of posts and set it to equal map(), and loop trhough each item in that array 
    // Lets remember that map lets us return a new array, so essentially we are going to create new array based on posts array and 
    // Then that new array that map generates is what we're ultimately going to save or overwrite into this posts variable
    posts = posts.map(function(post) {
      // We're just gonna customize or overwrite the author object, because we don't want to include things like users password
      // So we will manually spell out what should be in this author object, so we know for sure that we want username and avatar
      // Those are the only two properties that we want the author to have, now the question becomes, how can we use the user's
      // Email address to pull in their gravatar url to avatar: property, we will just reuse our user model
      // To do that, we first need to require into this file the user model, after that to author: property we create new instance
      // Of that user model using our blueprint, in terms of what we wanna pass to construction function, we will just say post.author
      // We also give another arg of true, Brad will explain this true soon
      post.author = {
        username: post.author.username,
        // So this is going to return an object and because that getAvatar method ran, it's going to have property named avatar
        avatar: new User(post.author, true).avatar
      }

      // Anything we do before this return, we are essentially manipulating the current item in the array
      return post
    })
    */

    // Here we write one more if statement, where we pass post variable because if above code finds the document, that's where it's gonna
    // Resolve to, but if it doesn't find a document, then essentially that variable is going to be empty so the if condition will not evaluate to
    // True, now we do need to be careful with timing of things, we don't want to execute ifelse, until the READ CRUD operation above has had
    // A chance to actually resolve, now we know that above mongodb method is going to return a promise, so right at the start of it we can say
    // Await, that way javascript will wait for the READ action to complete, before moving on to the next operation, but if we are going to use 
    // Await, we need to be sure that we are inside async function, so we give a parent function an async keyword before it

    // We've also added .length here to check if the array has more than zero items in it, then it evaluate to true
    if (posts.length) {
      // If we successfully found a post let's just have our promise resolve, with a value of that post document

      // Now after turning post to array of posts we want to resolve into posts[0] to just return the first item in that array
      console.log(posts[0])
      resolve(posts[0])
    } else {
      // If there is no post document for that id let's just reject
      reject()
    }
  })
}

// This function is going to be dangerously similar to our findSingleById function, the only real difference between this two functions is that
// One looks in the database for a match based on post id whereas the other would want to look in the database for a match where posts have a
// Certain author id, so in order to maintain reusability and save our code from duplication, we will create a new function that both of these
// Functions can leverage
Post.findByAuthorId = function(authorId) {
  // Now because in this case we are completely okay with returning an empty array of posts, because maybe an author doesn't have any posts yet
  // Since that's the case, we don't need really any logic here, meaning, since our reusable function returns a promise, we can just return
  // That reusable function, since it returns a function that's what this function is going to return, so ultimately our controller will still be
  // Working with the promise when it calls this findByAuthorId function
  return Post.reusablePostQuery()
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