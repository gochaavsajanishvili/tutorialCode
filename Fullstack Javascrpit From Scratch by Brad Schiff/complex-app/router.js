// It's the routers job to list out all of the urls or routes that we are on a lookout for
// So here we have to start by including the express framework so it's code would work here
const express = require('express')
// This way express will return some sort of mini application or a router, which means as I understand it that now we just granted a specific
// Functionality to the variable which is needed for router things only, that's why it's mini, we don't use full force of express here
// As it's not needed
const router = express.Router()

// This is same as app.get() or app.post() it works exactly the same way
router.get('/', (req, res) => {
  res.render('home-guest')
})

router.get('/about', (req, res) => {
  res.send("Jurichi")
})

// We are exporting the router variable of ours, that's what we are exporting and making available to any file that requires in, this file
// As I get it, we do this to make possible from the file where we require this router file to use the router functionalities
// @TODO The question is, why don't we just use those functionalities from full express package, maybe it is for files where also
// Only narrow amount of express force is used, gotta figure out for sure
module.exports = router