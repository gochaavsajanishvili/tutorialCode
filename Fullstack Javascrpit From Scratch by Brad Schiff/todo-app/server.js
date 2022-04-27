// Before installing express we typed npm init -y which created a file package.json, which keeps track
// of all the dependencies our app needs in order to run
let express = require('express')

let app = express()

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
app.post('/create-item', function(req, res) {
  // item is the name we specified on input, like this we extract the value which user types in input
  console.log(req.body.item)
  res.send("Thanks for submitting the form.")
})

app.listen(3000)

// With this we will be able autoreload node each time we change something in code, finally! no need for manual reloads!
// npm install nodemon

// To activate it we type in terminal/commandline, so it not only initially start the app but also monitors it for changes
// But it works only if we have installed nodemon globally, we will avoid it right now cuz brad said process often causes
// Errors for beginners, instead we will go to package.json and in scripts object we add "watch": "nodemon filename" property
// nodemon filename 

// After that we run the following command
// Here watch is the name of property we just created in package.json
// npm run watch