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

let app = express()

// There's no db variable that exists by default out of the box, we need to put a little bit of work to create this variable ourselves
// We need to setup a variable that represents the mongodb database to which we opened the connection to
// So how we establish the connection to mongodb database?
// First we need to go to npm and pickup mongodb driver for nodejs environment
// The command is npm install mongodb
// After installing it, we need to require that package like we did with express
let db

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
  app.listen(3000)
})

// We basically do the same thing as with submitted forms but now with async requests as well
app.use(express.json())
// Oh wow, we now will tell express to add all submitted form values to body object
// And then we add that body object to the req object! cuz by default express doesn't do this... yeah like that...
app.use(express.urlencoded({extended: false}))

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
          <form action="/create-item" method="POST">
            <div class="d-flex align-items-center">
              <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul class="list-group pb-5">
        <!-- Here we added the join method, which converts array into string of text and in its arg we can choose what will seperate each array item -->
        <!-- In this case we chose nothing -->
          ${items.map(function(item) {
            return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
            <span class="item-text">${item.text}</span>
            <div>
              <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
              <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
            </div>
          </li>`
          }).join('')}
        </ul>
        
      </div>
      
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
    // We changed this send line to redirect because after submitting the form we want to automatically go back homepage and see the result immediately
    // res.send("Thanks for submitting the form.")
    // Here in args we specify where we want our user to redirect, in this case we said we want to homepage, that slash means that
    res.redirect('/')
  })
})

// What we actually want to do here, is to communicate with mongodb database
app.post('/update-item', function(req, res) {
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
  db.collection('items').findOneAndUpdate({_id: new mongodbObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
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