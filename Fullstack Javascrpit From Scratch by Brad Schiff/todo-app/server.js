// Before installing express we typed npm init -y which created a file package.json, which keeps track
// of all the dependencies our app needs in order to run
let express = require('express')
// After making available mongodb package for us to work with lets use it to open the connection to database
// Which lives in our mongodb atlas account, we have to do it below db variable line
// @TODO so this code didn't work without .MongoClient on stackoverflow they said we are importing the class here as well
// Gotta figure out why so, maybe one day I will
let mongodb = require('mongodb').MongoClient
// const { MongoClient, ObjectId } = require('mongodb');
let mongodbObjectId = require('mongodb').ObjectId

// We installed the following package by running npm install sanitize-html
// And we will use it to make sure that the value users enter into our input fields is exactly that, what we expect
// From them and not some malicious scripts to cause security nightmare
let sanitizeHTML = require('sanitize-html')

let app = express()

// There's no db variable that exists by default out of the box, we need to put a little bit of work to create this variable ourselves
// We need to setup a variable that represents the mongodb database to which we opened the connection to
// So how we establish the connection to mongodb database?
// First we need to go to npm and pickup mongodb driver for nodejs environment
// The command is npm install mongodb
// After installing it, we need to require that package like we did with express
let db

// Making port number dynamic for heroku
// @TODO Okay so after adding this, means making port dynamic app doesn't run on localhost anymore, it works fine on heroku though
let port = process.env.PORT
// We provide fallback if above code doesn't work
if (port == null || port == "") {
  port = 3000
}

// Okay I didn't understood much this time but from what I grasped is, that users don't have access to root folder so we placed our js for web browser
// Into folder named public and then with the code below we allowed incoming requests to have access to that public folder
// This is how we serve up static existing files
// This will make the contents of that folder, available from the root of our server 
app.use(express.static('public'))

// We save connection string seperately because we don't want to make .connect method line to be too long
// This is where we tell mongo where or what we want to connect to
// In this case we want to connect to database which lives in our mongo db online atlas account
// So mongodb atlas will give us a snippet of code that will include an address which points towards our database
// And also username and password all bundled together in one big long string of text, we just include it here
// The it will be plugged into .connect() method and it will give us access, security and permissions
// In order to actually connect
// In the given connectionString we replace password placeholder with our actual password which we specified in atlas
// After pressing Connect button and before retryWrites line we have to specify the name of our database
// To which it will be connected, we created database especially for that in Browse Collections button
let connectionString = 'mongodb+srv://todoAppUser:123asdASD@cluster0.gurzr.mongodb.net/ToDoApp?retryWrites=true&w=majority'
// Here we pass three arguments
// First argument is gonna be a connection string, which tells mongodb where or what we want to connect to
// In this case, atlas account will give us code which we will copy and paste as first arg
// Third arg will be anon function and it will be called by .connect method after it opened the connection with first arg
// We pass two args to our anon function, first arg lets us to check if there's any error while connecting
// Second param client contains information about mongodb environment we just connected to 
// To .connect() method as second arg we pass object with mongodb config property 
mongodb.connect(connectionString, {useNewUrlParser: true}, function(err, client) {
  // This method going to select our mongodb database
  // And we update the global db variable as well
  // And this is perfect, it means that we can use our global db variable means database to use anywhere
  // In our code
  // But we have to remember that the following line of code won't run in the millisecond we launch our node app
  // It will run only after we successfully establish the connection with mongodb database, which could take second or two
  // This is important because we want to be sure that our db variable is good to go before the users visit the app
  // So lets just not tell our node app to begin listening for incoming requests until this line has had a chance to run
  // So we place app.listen(3000) after .db() cuz now we will now for sure, it will run after our database is ready
  db = client.db()
  app.listen(port)
})

// We basically do the same thing as with submitted forms but now with async requests as well
app.use(express.json())
// Oh wow, we now will tell express to add all submitted form values to body object
// And then we add that body object to the req object! cuz by default express doesn't do this... yeah like that...
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next) {
  // When visting home page we want user to enter username and password before entering our website
  // Here in res.set() method in first arg we pass the string of text which tells asks the browser
  // A username and password to authenticate itself
  // As for second arg we basically provide the name of our application
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
  // Here we log out to console whatever has user typed in as a username and password
  // It is encoded into base 64 code format, we can leverage that in terms of what we check for
  // To see if they typed in the correct username and password
  // Oh wow now I'm getting a glimpse of how registering works
  // Okay so here's what happens here, we type something in prompted fields and req.headers.authorization
  // turns it into base 64 code format, we log it out to console, copy that and place into if statement
  // Condition, that means now we have set the username and password required to enter the website
  // The condition will render true only after visitor typed in the username and pass we set in as base 64 code format
  console.log(req.headers.authorization)
  // Here as the condition we say, only if the username and password that the visitor enters equals something specific
  // Only then we run the function by calling next() that sends them to the home page
  // With req.headers.authorization we access the username and password that visitor typed in
  if (req.headers.authorization == "Basic YWRtaW46YWRtaW4=") {
    next()
  } else {
    // But if they didn't enter the correct username and password then lets send back the error message
    // With res.status(401) we send back the http code of 401 which means unauthorized
    res.status(401).send("Authentication required")
  }

  // When user visits certain url and accordingly calls this function, when it is done
  // The next() function will tell express that we are done here, move up to the next function
  // next()
}

// This way we tell express to use function passwordProtected to all routes means all app.get and app.post-s
// So it's going to be added as a function to all our urls and when our custom function calls next()
// That will call whatever the next function for that route would be
app.use(passwordProtected)

// Express is a framework we are using to create web applications with node
// Express offers this basic syntax either app.get or app.post and for the first arg
// You spell out the url you're listening for and the second arg is function that we provide
// That express will call when the request happens
// We were familiar with that, but we weren't familiar with that we can provide multiple functions here
// Now we are giving here three args, but if we wanted to we can give 5 or 10 arguments
// The idea that after we provide the url we are listening for, we can provide multiple functions
// And express will call each function, one at a time in a row
// That where comes the next() function above the code 
// app.get('/', passwordProtected, function(req, res) we removed the function passwordProtected from args
// To make it more efficient and not add the protection to each route separately but to declare a line which
// Will tell express to use passwordProtected function for all routes, check line 100 or below it it's app.use(passwordProtected)
app.get('/', function(req, res) {
  // Brad promised that we won't do this anymore :d
  // We don't want to display/send this html as soon as user sends request anymore, we now want to connect to database before it
  // So we could read data from and for further display to user
  // Here we access the database collection and use .find() method on it to READ from it
  // In .find() method we can send query as an argument to filter out the data, intuitically, to find or READ all data, we leave paranthases blank
  // .find() method is gonna return data in a format which is hard to read for people and is not easy to work with javascript, so we use
  // .toArray() method to convert that data into super easy to work with javascript array
  // .toArray() expects function as an argument, which will be called only after the database operation before it is complete
  // the items param will get the array value
  db.collection('items').find().toArray(function(err, items) {
    // Brad is big fan of visualazing data before making next move :d
    // console.log(items)
    // We moved up the html code into this function, because we don't want to page display before the above database function has had a chance to complete
    res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <!-- Here we go, we specified url for form to be submitted which we just wrote logic for what to do after submition -->
          <!-- And we added post req so it gonna trigger the post method in js -->
          <!-- We added id so we can easily select this form from js -->
          <form id="create-form" action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <!-- We added id so we can easily select this input from js same as form above and gonna be with ul below -->
              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <!-- We added id so we can easily select this ul from js -->
        <ul id="item-list" class="list-group pb-5">
        <!-- Here we added the join method, which converts array into string of text and in its arg we can choose what will seperate each array item -->
        <!-- In this case we chose nothing -->
        <!-- 
          ${items.map(function(item) {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
          }).join('')}
        -->
        </ul>
        
      </div>
      
      <!-- Here we are sending the raw data to the web browser to implement client-side rendering, instead of generating html of our dynamic -->
      <!-- Data on server side and then sending that html to web browser, instead of that with client-side rendering, the server will send -->
      <!-- To browser only raw data, in this case our array named items, and then it would be up to web browser or client to use that data -->
      <!-- To generate the appropriet HTML -->
      <!-- Web browser has built-in object named json - javascript object notation - super popular way of sending data back on forth  -->
      <script>
        // We look inside the json object with the method stringify and it will convert the javascript data or json into string of text
        // Into array of objects to be more specific 
        // So within the parenthesis we just let it know which data we want to convert
        // We pass items because that's our array of database objects or database documents 
        let items = ${JSON.stringify(items)}
      </script>

      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/browser.js"></script>
    </body>
    </html>`)
  })
})

// So again, to receive user data, we use this method
// Be sure to include req, res, which express framework gonna pass into our function
// In a body of our function, we do what we want in response to incoming request on '/create-item'
// After this we adjust the html so when user actually submits the form, the input will be sent to the url we are expecting
// In this case '/create-item', because we just wrote the code which is assuming that form will be submitted to it
// Just to remember, we haven't explicitly created the page for create-item, it is generated buy send method as I see it right now
// During the submition
// Here we respond to incoming post request to /create-item url
// This is what we do in response to user submitting the form

// Now we will implement the security here to prevent users entering malicious scripts into our code
// We will do it to req.body.text
app.post('/create-item', function(req, res) {
  // The first arg here is the text or the input which we cleanup or sanitize
  // So that will be our user input, in this case, req.body.text, whatever user typed in
  // And as a second argument this is where we include a few options
  // So we include a javascript object
  // This package has one option named allowedTags and we set it to empty square brackets means empty array
  // Because we don't want to allow any html tags
  // Then we add another option allowedAttributes and set it to empty object
  // This way we don't allow any html tags or attributes
  // So now whatever user typed in will be stored to this safeText variable @TODO Brad called it property, gotta figure out why
  // And it's only going to be a plain, cleaned up text, nothing evil or malicious, so that's what we want to save into a database
  // So into insertOne() method get rid of req.body.text and add this safeText variable
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})

  // Item is the name we specified on input, like this we extract the value which user types in input
  // console.log(req.body.item)

  // As the first argument for insertOne() method we pass an object, that is the object which is gonna be stored as a document in a db
  // That object is where we make up properties and values
  // But in this case we need one property which will represent the text in the to-do list item
  // We can choose any property name we want but brad will call it text:
  // As the second argument we will pass the function which insertOne() method will call only after successfully creating the document in db
  
  // We've changed req.body.item to req.body.text because now we are sending the user value async and text is the property name we chose for that
  
  // req.body.text is what users are entering and is what might be potentially malicious, so thats what we gonna sanitize before we insert it
  // To database
  // We removed here from .insertOne({text: req.body.text}) the req.body.text and instead of it added the plain, safe, sanitized user input
  // With safeText variable and that protects our current create-item route
  db.collection('items').insertOne({text: safeText}, function(err, info) {
    // This line was written outside of this function and we moved it up because we didn't want it to display asap, we wanted it to
    // Display after the document is created in the db
    // We changed this send line to redirect because after submitting the form we want to automatically go back homepage and see the result immediately
    // res.send("Thanks for submitting the form.")
    // Here in args we specify where we want our user to redirect, in this case we said we want to homepage, that slash means that
    
    // Now once the database action completes instead of res.redirect('/') redirecting the browser back to the homepage for a full page reload
    // We just send back the message of success

    // Now we gonna use json, it stands for javascript object notation, it is very popular way of sending data back and forth
    // Our goal here is to send new js object which represents the mongodb document we just created
    // We can look inside the new info param and it contains the array named ops[0] and if we look inside that array for first item
    // That will be a js object which represents the new document that just got created
    // @TODO Here should be res.json(info.ops[0]) but I had to change the code to this because after update of mongodb from 3x to 4x
    // It seems info wasn't returning property ops anymore, only acknowledged and insertedId
    // acknowledged - Indicates whether this write result was acknowledged. If not, then all other members of this result will be undefined
    // insertedId - The identifier that was inserted. If the server generated the identifier, this value will be null as the driver does not have access to that data
    // Had to change text: req.body.text to safeText here to sanitize it, or otherwise the malicious code was slipping through in browser, not
    // To database but in browser js, Brad didn't had to do this because he had this info.ops[0] option
    res.json({_id: info.insertedId.toString(), text: safeText})
  })
})

// What we actually want to do here, is to communicate with mongodb database
app.post('/update-item', function(req, res) {
  // So we do sanitize it in here too, because user can press edit button and enter the malicious code from there
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  // In the next video, this is the place where we will communicate with the database to update the document
  // For now we just console.log the users typed in data for a test, just to make sure, our server is successfully receiving the data

  // This is the data that axios is sending over
  // console.log(req.body.text)
  // res.send("Success")

  // We use db to access our database, then it's collection named by us items and on that we use method findOneAndUpdate()
  // To locate desired document and modify it
  // We pass three args to the .findOneAndUpdate() method
  // In first arg we tell mongodb which document we want to update
  // In the second arg we tell mongo what we want to update in chosen document
  // We pass object and in that object we pass to the property $set another object where we choose which document properties will be modified
  // In this case, we only change text property and set it to user input
  // In the third arg we include an anonym function which will be called once this database update action gets complete
  // So we send the id of document in the first arg but mongodb works with the ids in a special way, so we cannot just pass the string of text there
  // Instead we need to create new instance and then we gonna look inside mongodb PACKAGE (dot to look inside it) for something named ObjectId and then
  // Parenthesis to call that and in that parenthesis, that's where we include the simple text representation of the id
  // console.log(req.body.id)
  // let id = new mongodbObjectId.ObjectId(req.body.id)
  // Okay so for the first arg the Brad way new mongodb.ObjectId(req.body.id) didn't work out
  // We had to require the ObjectId class separately but as there were solutions on stackoverflow it didn't workout
  // Like then calling the .ObjectId() method on that newly required class
  // We just had to simply pass the req.body.id to the newly required class like the code below to make it workout
  // I don't know what mongodb updates or changes caused this, I have to @TODO it to figure it out
  // But for now I'm a bit lazy and unfocused to do that, so I will leave it as is for future self 

  // Here we changed $set: {text: req.body.text} to $set: {text: safeText} to clean sanitized version of user input
  db.collection('items').findOneAndUpdate({_id: new mongodbObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res) {
  // Second arg is a function which runs after this database action gets complete
  // In first arg we tell mongodb which document we want to delete
  db.collection('items').deleteOne({_id: new mongodbObjectId(req.body.id)}, function() {
    res.send("Success")
  })
})

// With this we will be able autoreload node each time we change something in code, finally! no need for manual reloads!
// npm install nodemon

// To activate it we type in terminal/commandline, so it not only initially start the app but also monitors it for changes
// But it works only if we have installed nodemon globally, we will avoid it right now cuz brad said process often causes
// Errors for beginners, instead we will go to package.json and in scripts object we add "watch": "nodemon filename" property
// nodemon filename 

// After that we run the following command
// Here watch is the name of property we just created in package.json
// npm run watch

// npm uninstall <packageName> uninstalls the chosen package

// We are now starting to upload our app to net to make it globally available for friends and family so the first steps are, we install git
// Check with cmd or terminal the availability of it with > git --version command
// Next we need to give git a basic information
// So now we type > git config --global user.name "Gocha" no need to give real name, we can give anything but well I chose mine
// And > git config --global user.name "youremail@mail.com"
// heroku.com free hosting company, industry standard for beginners or at least Brad said it is
// On heroku we press New App and then we have to install heroku CLI which stands for Command Line Interface
// We download the preffered OS installer and install with all the default options
// Once we istall it, our next step is to connect our cmd to our heroku account
// So the tool we just installed gave us access to heroku commands
// We type > heroku login
// On windows we need to restart to make heroku commands available in our cmd, goddammit windows :d
// Also during login on windows it sends us to browser where we simply press login button and if we were logged in on website already, it
// Will log us in automatically, without need to enter pass
// Okay after that our command line is logged in to our heroku account, this means now we can send our application files to heroku
// But first we need to create new file in our apps main folder, that tells heroku which one of our files is main file that powers our app
// We know that it's server.js but heroku cannot read our mind
// We create file named Procfile (no need for extension)
// We type in the file > web: node server.js
// So that just tells heroku that when it's time to launch or start our application that line is what it needs to do
// Now we need to make our app.listen(3000) port number dynamic, cuz it makes sense when it runs on our local computer
// But we don't know which port will heroku use, so that's why
// So we will add after let db and before listening to port code the line let port = process.env.PORT
// We also provide fallback if there is no port number and set it to 3000 so that way in any environement, our port number will make sense
// After that we replace in app.listen(3000) the number with our port variable app.listen(port)
// Now we need to prepare git so it is ready to send our files to heroku
// to do that in cmd we type > git init
// Okay after typing that we turned our folder into empty git repository, Brad is now creating .gitignore, I already have connected
// This folder to github, lets see how it will go for heroku, it is not tracking all file rn because there are no changes in all of them
// Hmm, Brad only excluded node_modules in gitignore, left package-lock.json, but I have it excluded, lets see how it goes
// We now type in cmd > git add -A
// This adds all files to git
// Now we want to commit files into git so we type > git commit -m 'Deploying App To Heroku'
// The message can be anything btw
// Hmm, it does seem that this operations yet doesn't affect my connection with github, not M symbol nor U symbol infront of Procfile changed
// Maybe that's because this way we are acting in empty git repository? It was written when I typed git init
// Okay anyway now our git repository is ready to roll on our local computer, now we just need to push it up or send it out to heroku
// We type command > heroku git:remote -a todoappforga
// after -a we type in the name of app we previosly named from heroku website interface it's gonna be different every time
// Now we type final command > git push heroku master
// By bein familiar with git it usually is git push origin master where origin typically being github or bitbucket in this case instead of origin
// We push our master branch to heroku
// And yeey it succeeded!
// In this case we go to heroku.com/apps/ourappname/deploy/heroku-git and press on Open app button which takes us to url which
// Also was specified in cmd after the previous command and that's where our app resides now, up and running!
// And package-lock.json wasn't needed on heroku!