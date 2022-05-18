// ../ is how we move up one directory or folder
// We will now learn how to create a javascript object using this blueprint or constructor function
const { redirect } = require('express/lib/response')
const User = require('../models/User')

// We already know what this next param is, but just to remind ourselves, with that function
// We tell express that current route function is done and the next one can be leveraged
exports.mustBeLoggedIn = function(req, res, next) {
  // There only will be user object within session data if user has successfully logged in
  // If that's the case, then we call next()
  if (req.session.user) {
    next()
  } else {
    req.flash("errors", "You must be logged in to perform that action.")
    req.session.save(function() {
      res.redirect('/')
    })
  }
}

// Our goal in this file is to export multiple functions that can be accessed from another javascript file
// Now we gonna use alternative way of exporting from this file instead of listing functions in object like this
// module.exports = {login: function() {...}, logout: function() {...}}, we will use cleaner way
// To export multiple functions from a file, after . we make up a property name and set that to equal whatever we want
// In this case to a function, now when the node environment sees this code it's going to know what to do with it
// It will make sure that property named login will be added to what's going to be exported from the file
exports.login = (req, res) => {
  // We called this one here to get the user input data to then work with it
  let user = new User(req.body)
  // Okay so we will now go to our user model where we will create this login() method
  // Remember because it's model not controller that handles the business logic and managing all our data
  // So in terms of looking up a username and password in the database that should definitely be done in our model
  // Not in our controller
  
  // We don't know how long this login() method is going to take, because it's working with the database
  // We have to wait till login() method finishes its job and then send our response to the browser
  // There are many ways to set this up but for now we will use traditional and later best practice approach
  // Traditional approach is called callback function, since we don't know how long login() method will take
  // We can provide it a function as an argument, so that function is an arg that's going to get passed in to our
  // Login function, so back in a User model file, when we are defining what this login() method should be
  // We should receive that incoming function with a parameter, we will call it callback
  // So we are passing this anonym function as an argument into login and then when we define that login function
  // We are waiting until the perfect moment to call that function, in other words we know that this function
  // Is not going to run until the appropriate moment and as in model we are passing strings rn, we added here result param to receive them

  // We no longer want to use traditional callback function approach so we will replace the anonym function with result param and res.send(result)
  // Line to modern promise way of doing things
  // So now this login function (or method, Brad started calling it function but used to call it method) will return a promise
  // We use it like this, after the function which returns the promise we type .then() and after that .catch(), then() for success
  // And catch() for failure, within then() and catch() we provide functions
  // So if our promise was successful, meaning our promise called resolve instead of reject
  user.login().then(function(result) {
    // We want to send response back to the web browser, and we can receive whatever value the promise resolved with by including param
    // Within anonym function's parenthesis, we can call it anything but lets just call it result

    // So if some1 types the correct username and password we would want to log them in, or in other words this is where we would want to
    // Leverage sessions, after typing req.session now we can add new properties on to this session object, lets make up a property named user
    // There is nothing special about that word, Brad has just made it up, this could be literally anything, the idea is that our request object
    // Now has this session object that is unique per browser visitor, so we gonna add new property user to that session object and set it equal to
    // An object, now in this object we can store any information we want and it will be specific to that one visitor or web browser
    // So we could make up all sorts of different properties, we could say {favColor: "blue", username: user.data.username}
    // Whole idea of a session is that it allows us to have some sort of persistent data from one request to another
    // Meaning, that our server is going to remember this session data, in other words, we could use this session data
    // From any of our urls or routes
    // So when visitor types in correct username and password values meaning below code ran, two things happened
    // Number 1: Our server is going to store this session data in memory
    // Number 2: What the session package is also going to do is send instructions to the web browser to create a cookie
    // To see cookie, in chrome go to webpage, right click and click inspect, find Application tab, it might be hidden under
    // Extra arrows there and there we go, within left hand sidebar under Storage we see an area named cookies
    // If we expand our cookies option we see current domain, in this case localhost:3000, if we click it we will see all of the cookies
    // For given domain, in this case only one, so our session package sent instructions to the browser to create a cookie with the name
    // Of connect.sid and this is the important part, it has a unique value, now that value is unique identifier for that particular
    // Session data, that's being stored on the servers memory, once the web browser has the cookie, it's going to send any and all cookies
    // For the current domain back to the server with every single request and that is going to happen automatically
    // So now anytime we visit, any localhost:3000 url, our google chrome web browser is going to send this cookie and value back to the node server
    // So our server is going to see this unique identifier value and say aha, the only way you would  know this unique session identifier is if
    // I just send it to you in a cookie, so the server says the fact that you know this session value, that means I can trust you
    // Or I can trust that you're the same person or the same web browser that just typed in the correct username and password
    // You're the same person or same browser that I just sent his value to, a moment ago
    // When you restart a computer or server, it's memory is cleared, so if we try to send a request to our local domain
    // After restarting the server, because it cleared all of the session data that was in memory, the server doesn't remember me
    // So to get around this, instead of storing session data in memory, we will store session data in mongodb database
    // Not only it is more robust way of storing data, but it will also let us visualize a piece of session data
    // In firefox alternative name for Application is Storage

    // So if we are gonna save sessions to mongodb database we will need the NPM package for it named connect-mongo
    // The command to install it is > npm install connect-mongo

    // So this happens automatically, but as we work with databases we don't know how long it's gonna take, so we will also
    // Use manual method, because of our redirection, so that we will be sure that redirection will happen only after this info is saved
    // In database

    // We removed useless favColor: blue and added the avatar property
    // Just some lines above we created a user variable using our model as a blueprint, so we know that in memory is going to be
    // A property avatar on that object and we are saving it in a session so as long as that user stays in, we don't need to calculate
    // Gravatar again, we gonna do same thing to our register function
    req.session.user = {avatar: user.avatar, username: user.data.username}
    // Alright! I achieved it! I made it so after login user goes straightly to dashboard without this stupid congrats message and need
    // To do it manually, but well, lets wait for brad to do it
    // res.render('home-dashboard', {username: req.session.user.username})
    // res.redirect('home-dashboard', {username: req.session.user.username}) // I will uncomment this if brad writes it 
    // So neither of above commented codes were good solutions, but I was close enough, we don't need to add home-dashboard here as well
    // Because when receiving req to base url, it is automatically checked on session and if session is, it automatically gives proper page

    // This save() method will not be called before the session data completes saving into database
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch(function(e) {
    // Now in case of catch, it is industry standard to call this param e or err or error, Brad chose e
    // res.send(e) 
    
    // Here we will leverage the flash package, which will add flash object to req object
    // Within those parenthesis we give two args, first arg is the name of a collection or an array of the messages that we want to
    // Start building or adding onto
    // For the second arg we include an actual message that we want to add onto this array or collection
    // Instead of typing a string directly we pass the value of e, because that's the value the our promise is going to reject with
    // And so that will get passed into this function, so essentially this is just string of text that says - Invalid username / password
    // And all this flash package is going to do is help us add or remove data from our session, the flash package is really simple
    // It's actually 82 lines of code (at least for 2019 it was that number), we could right the similar code ourselves but this package
    // Will make our lives simpler and woow again, this interconetion of code, functions and files with each other in programming
    // I can't get enough of this, it amazes me every single time!
    // Okay so this line is going to result in the following: 
    // It's going to look into our session, so req.session, now in a previous lesson we added a property or object to the session named user
    // req.session.user, in this case it's going to add a property or object named flash and then inside that object there's going to be a porperty
    // Named errors, req.session.flash.errors, because that's what we named our collection and that's going to be an array so
    // req.session.flash.errors = [], and in this case we only pushed one item e into the array, which is that message that's gonna say
    // Invalid username / password.
    // Now that we know that this line is going to modify our session data and because we know that's going to require a trip to the database
    // Which can take some time, we wanna be sure to not perform redirect, until that database action has actually completed, our session package
    // Will automatically save to the database anytime we call res.send() or res.redirect(), but there's no guarantee that it would finish in time
    // Before the redirect
    req.flash('errors', e)
    // So as the solution to this situation we will manually tell our session to save and then provide the callback function which is going to be
    // Called after the database save is completed
    // So idea is here that, because we saved this error message in a session, it's persistent, it's going to stick around for a while
    // So it will be available even after a redirect
    req.session.save(function() {
      // Now instead of above res.send() we want to redirect the users back to the home page
      // If we preform a redirect, that's going to be considered as new separate request
      // Since we are redirecting to the home page our router is going to call our home function
      res.redirect('/')
    })
  })
}

// So if the current incoming request from a browser has a cookie with a valid or matching session id
// Below code is going to find that in the database and destroy that session
exports.logout = (req, res) => {
  // So that's how we logout, by killing the poor sessions
  // Okay so after destroying the session we want to redirect user to homepage but the problem is we don't know when this destroy()
  // Method will finish it's job, cuz well we interact with a database, so we gotta time it out in a way so the redirection
  // Didn't happen until the session is dead, we could do it with promise but in given time period of tutorial session methods
  // Doesn't return promises, so we will do it in oldschool callback way @TODO check if session methods now return promises and refactor code 
  req.session.destroy(function() {
    // Because there are different homepages depending on if user is logged in or not, we really need to wait for this destroy() method to finish
    // To don't show user wrong template
    // We don't click on back button to check wether we loggedout or not, cuz browser uses cached copy of url and it might show the loggedin
    // Template, user won't have that problem because we bind to each button the proper redirection, means proper request so page will update 
    res.redirect('/')
  })
}

// This router is gonna call the function whenever some1 submits the register form

// Okay so if the user has validation errors when they submit the registration form, we will redirect them back to the same home page
// And use flash messages to show the errors above the form, yeeah I guess where we will work on this so started those comments here!
exports.register = function(req, res) {
  // With this console.log we confirmed that our controller is able to access visitors input
  // Our next step will be to validate this data and enforce our rules or business logic on it 
  // console.log(req.body)
  // new keyword is going to create new object using User() blueprint
  // So about uppercase, we do not have to capitalize it, it's just a common convention or preference amongst many programmers
  // To capitalize your blueprint (why he calls class a blueprint I don't get it, it kinda frustrates me, cmon' Brad, start calling it a class already!)
  // I mean I know that class is a blueprint of an object but well.. okay whatever it's 5am I wanna go to bed :d 7th hour of study goddammit
  // Okay so we capitalize the blueprint name so it will be easier to distinguish it from the object which we are creating from it
  // Within parenthesis we have to pass here form field values that visitor just submitted
  let user = new User(req.body)
  // Now that we turned this into async function in Users.js for validation purposes, we have to make sure that we give it a chance to actually
  // Complete, before the next operation would begin, we will now adjust the register function, so it returns the promise and then we can await
  // That promise, here within our controller
  // Okay so as I get it, instead of await we are using .then(), it works similar, it waits for register() function to complete before it executes
  // If our promise is successful and resolves, then() will take care of it, if it rejects, catch will take care of it, we will pass functions
  // to then() and catch(), the arrow ones to don't affect the this keyword 
  user.register().then(() => {
    // So if user registration is successful, we instead of showing them stupid 'Congrats' message, will redirect them to home page
    // But update their session data so they're actually logged in
    // So we begin working with session data, to actually log them in, we want to create user property on the session and for now
    // All we really need is to store the username, so we give our object a property of username and set that to whatever username they
    // Just successfully registered with, in the future, we will set things up so our controller doesn't even need to be aware of this data
    // Structure and instead, our promise will resolve back with the necessary data, but for now this will do the job
    // After we set this data, then we want to redirect our users back to the home page url

    // We've added avatar property to be saved into session here too
    req.session.user = {username: user.data.username, avatar: user.avatar}
    // We use manual save even though sessions save automatically, to wait till the database action in this case that save of username to
    // Session is completed and only then run the redirect
    req.session.save(function() {
      res.redirect('/')
    })
  }).catch((regErrors) => {
    // So as catch handles the error side, we will add a code which adds flash messages for errors to catch()
    // The regErrors param of catch() method will be filled with value that promise rejects with, we will reference that
    // Instead of user.errors here, cuz it's basically same and just so this way our controller doesn't have to be aware of our data structure
    // It's only calling the promise and letting the model deal with all of the data and the variable names
    regErrors.forEach(function(error) {
      req.flash('regErrors', error)
    })
    req.session.save(function() {
      res.redirect('/')
    })
  })
  // Any value other than 0 evaluates to true so if there are any errors we will send them back to the user here
  // In the future we will set things up so that controller won't even need to have this basic logic of checking the errors array
  // Ideally even this sort of logic should be left to model, not to controller

  // Now as we made the user.register() function return a promise, we don't need this ifelse block anymore, we will use .then() and .catch()
  // To replace it, so I will comment it out
  /*
  if (user.errors.length) {
    // res.send(user.errors)
    // Instead of straightly sending those errors to user, we will use the flash package to add those same errors into our session data
    // Then once we've done that, we can just redirect back to the home page, now we will begin working with our array of validation errors
    // forEach() gonna call the passed function once for each item in the array, we pass param to function, to which forEach() will pass
    // Array item one after another, we can call it anything but for now we will call it error, as we work with errors ya know
    user.errors.forEach(function(error) {
      // We chose different name this time for the flash array here, as we used previously the simple errors name for login errors
      // I guess it will be good idea to always specify in the name, type of errors, even for the first time, to distinguish them
      // Between each other @TODO change it for login
      // Again, second arg is error which we want to push onto the flash array
      req.flash('regErrors', error)
    })
    // Still inside the if, that's where we want to redirect back to home page, but now full of errors for user :d
    // So because flash is going to adjust our session data, that's going to require a trip to the database, so we don't actually want to redirect
    // Before that database action has been completed, so we gonna manually trigger the save to session and use that method to call the callback
    // Which will only be called after the trip to database was completed so the redirection will happen after that trip
    req.session.save(function() {
      // After this we will go to our home function and adjust it to use our new session data
      res.redirect('/')
    })
  } else {
    res.send("Congrats, there are no errors.")
  }
  */
}

// This is the function which gonna be called when some1 visits the base url
// If they're loggedin they would see personalized dashboard
// But if they're not loggedin they should just see guest home page template

// Lets use given session data if someone visits the homepage or base url 
exports.home = (req, res) => {
  // The only way that this user object would ever exist on the session object is if they just performed a successful login
  if (req.session.user) {
    // When we render the template, first arg should be the name of the template ofc, but we can also include
    // Second arg, where we can provide object with which we can include any data, which we want to pass in
    // to the given template, we can make up any properties we want, but for now we will choose username

    // So with username here we passed the avatar address to template as well, to leverage it from there
    res.render('home-dashboard', {username: req.session.user.username, avatar: req.session.user.avatar})
  } else {
    // If user is not logged in means, don't have any session data, we send them to guest template

    // Now we want to render this template with red warning box or error box that says invalid username or password
    // Because of stateless http request, our server has no memory that the login has just failed
    // And also we don't want to always show that warning when we render the home page, only after users fail to login
    // So as we've learnt, when we need some sort of persistent memory of previous request we can leverage sessions <<< oh yeah I guessed last word!
    
    // With second arg, we pass data to into a template we give it an object and we want to have a property in this case named errors
    // And for it's value, we would just want that errors array from our session data, we could acess that manually by typing 
    // req.session.flash.errors, BUT, and this is the big reason why we use flash package, we don't only want to access that data, we also want to
    // Delete it from the session, as soon as we've accessed it, because we only want to show this message to the user once, so with the flash
    // Package as soon as you access it, it's also gonna delete it for us from the session
    // So we say req.flash('errors') and give it as an arg the name of collection or array of messages that we are interested in
    // We now gonna leverage this data from our home-guest template

    // We've added another property with regErrors with users registration mistakes, we set those properties to pull in the flash data
    // Within the flash() parenthesis we are interested in collection which is named after specific errors
    // From here we go to given template and leverage this passed errors data
    res.render('home-guest', {errors: req.flash('errors'), regErrors: req.flash('regErrors')})
  }
}

// @TODO why we have to require('express') in router.js and not here, maybe cuz we aren't using any express code here? idk, gotta check for sure