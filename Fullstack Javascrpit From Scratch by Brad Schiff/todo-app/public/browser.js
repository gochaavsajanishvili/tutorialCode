// Okay, this line here lets us listen to any click events across the document
document.addEventListener("click", function(e) {
  // But as we want to only listen to click event on an Edit button, we use the following code to specify it
  // .target property here is the html element that got clicked on
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("Enter your desired new text")
    // To send the request to the node server on the fly (whatever that means) Brad uses axios library instead of modern browser fetch method
    // He says it's more clean and minimal
    // We import axios with cdn in this case, into our html
    // With axios.post() we send on the fly post request to the server
    // Into post() method as a first arg we put url to which we want to send the post request to
    // As second arg we sent data which will be sent along with the request to specified url it is a data that server will receive
    // This axios.post() gonna return promise, it is very useful when we are not sure, for how long the action is going to take
    // We use this instead of standard callback function pattern, so basically once we got the promise we can chain .then() and inside of its
    // Parenthesis we include anonym function that is not going to run before the post action is complete
    // And finally in catch() parenthesis we include the anonym function which will run if the post() action runs into the problem
    // Okay now we have to receive this from the serverside, continue to server.js line 150
    axios.post('/update-item', {text: userInput}).then(function() {
      // do something interesting here in the next video
    }).catch(function() {
      console.log("Please try again later")
    })
  }
})