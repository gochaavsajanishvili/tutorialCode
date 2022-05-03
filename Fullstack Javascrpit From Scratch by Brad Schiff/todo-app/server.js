// Before installing express we typed npm init -y which created a file package.json, which keeps track
// of all the dependencies our app needs in order to run
let express = require('express')
// After making available mongodb package for us to work with lets use it to open the connection to database
// Which lives in our mongodb atlas account, we have to do it below db variable line
// @TODO so this code didn't work without .MongoClient on stackoverflow they said we are importing the class here as well
// Gotta figure out why so, maybe one day I will
let mongodb = require('mongodb').MongoClient

let app = express()

// There's no db variable that exists by default out of the box, we need to put a little bit of work to create this variable ourselves
// We need to setup a variable that represents the mongodb database to which we opened the connection to
// So how we establish the connection to mongodb database?
// First we need to go to npm and pickup mongodb driver for nodejs environment
// The command is npm install mongodb
// After installing it, we need to require that package like we did with express
let db

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
  app.listen(3000)
})

// Oh wow, we now will tell express to add all form values to body object
// And then we add that body object to the req object! cuz by default express doesn't do this... yeah like that...
app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
  // Brad promised that we won't do this anymore :d
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
        <form action="/create-item" method="POST">
          <div class="d-flex align-items-center">
            <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
            <button class="btn btn-primary">Add New Item</button>
          </div>
        </form>
      </div>
      
      <ul class="list-group pb-5">
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">Fake example item #1</span>
          <div>
            <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">Fake example item #2</span>
          <div>
            <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
          <span class="item-text">Fake example item #3</span>
          <div>
            <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button class="delete-me btn btn-danger btn-sm">Delete</button>
          </div>
        </li>
      </ul>
      
    </div>
    
  </body>
  </html>`)
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
app.post('/create-item', function(req, res) {
  // Item is the name we specified on input, like this we extract the value which user types in input
  // console.log(req.body.item)

  // As the first argument for insertOne() method we pass an object, that is the object which is gonna be stored as a document in a db
  // That object is where we make up properties and values
  // But in this case we need one property which will represent the text in the to-do list item
  // We can choose any property name we want but brad will call it text:
  // As the second argument we will pass the function which insertOne() method will call only after successfully creating the document in db
  db.collection('items').insertOne({text: req.body.item}, function() {
    // This line was written outside of this function and we moved it up because we didn't want it to display asap, we wanted it to
    // Display after the document is created in the db
    res.send("Thanks for submitting the form.")
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