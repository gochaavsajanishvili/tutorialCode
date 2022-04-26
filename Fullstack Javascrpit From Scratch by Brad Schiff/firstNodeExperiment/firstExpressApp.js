// As we can see the syntax is equal as in case of node http, difference is, express isn't built-in part of node
// Meaning that before we use it, we need to download express through npm
// So when we say require("express") node will look it in the node_modules
let express = require("express") // This line of code gets express ready

// Now we have a server that lives in a variable ourApp
let ourApp = express() // This function creates/returns an express application/server

ourApp.use(express.urlencoded({extended: false})) // This is enabling the feature in express which makes users input easily accessible from req.body object

// We are telling ourApp what it should do, when it receives get request to given url, in this case to '/'
// This get method we use is instead of if statement from previous lesson
// '/' Here means homepage or base url 
ourApp.get('/', function(req, res) {
  // So with the send method we send back the response to users req
  res.send(`
  <form action="/answer" method="POST">
    <p>What color is the sky on a clear sunny day?</p>
    <input name="skyColor" autocomplete="off">
    <button>Submit Answer</button>
  </form>
  `)
})

// Now we are telling our app, what it should do when it receives post request to given url
// req object contains all sorts of information about the incoming request
ourApp.post('/answer', function(req, res) {
  // Here the body object is the body of the post and inside that we're looking for the skyColor property which we created with html in above code
  // And because html form can contain multiple fields so we need to specify which specific field or value we are interested in
  if (req.body.skyColor.toLowerCase() == "blue") {
    res.send(`
    <p>Congrats, that is the correct answer!</p>
    <a href="/">Back to homepage</a>
    `)
  } else {
    res.send(`
    <p>Sorry, that is incorrect.</p>
    <a href="/">Back to homepage</a>
    `)
  }
})

ourApp.listen(3000) // We now started listening to incoming requests on port 3000