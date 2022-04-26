// To feed following code to node type in terminal node fileName

// In a node environment, when we use a special node word or an ability in this case http, we need to explicitly tell node to import/require that functionality
let http = require("http")

// Creates server, in parentheses we specify a function which will be executed in RESPONSE to incoming server REQUEST
// We specified two parameters to our anonymous function req = REQUSET & res = RESPONSE. We could name it anything but those are just logical names to pick
// Server's gonna pass the request and response objects to our function everytime it calls it
let ourApp = http.createServer(function(req, res) {
  // req.url contains information about url which user is currently visiting, so we test it out with ifs and send proper response, depending on a url which user visits
  if (req.url == "/") {
    return res.end("Hello, and welcome to our home page.")
  } 

  if (req.url == "/about") {
    return res.end("Thank you for the interest in our company.")
  }

  // If user visits a page which doesn't exist we send him/her following response
  return res.end("Error 404! We cannot find page you're looking for!")
  
  // When user sends request we send back our response ending it with a following message
  // res.end("Hello, and welcome to our website.")
}).listen(3000) // We can chain listen to createServer anonymous function

// We need to pass the port as an argument to listen() method, in this case 3k so when entering the app we then we type localhost:portNumber
// ourApp.listen(3000)

// @TODO I had to add return before res.end to prevent throwing error after user visits one of urls, it was making me re-run server again and again for each visit, but tutor in video did this 
// without returns, so gotta figure out what the hell 