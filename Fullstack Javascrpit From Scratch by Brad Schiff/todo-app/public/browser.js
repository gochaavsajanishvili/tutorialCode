// Okay, this line here lets us listen to any click events across the document
document.addEventListener("click", function(e) {
  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      // Here we no longer send userInput because for deleting the element we don't need it, we just send the id of element
      // Which we wanna delete
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function() {
        // We no longer need to look for span and change it, here we just remove the entire element
        e.target.parentElement.parentElement.remove()
      }).catch(function() {
        
      })
    }
  }
  
  // Update Feature
  // But as we want to only listen to click event on an Edit button, we use the following code to specify it
  // .target property here is the html element that got clicked on
  if (e.target.classList.contains("edit-me")) {
    // Here we added second arg to prompt to make it filled with the chosen editable element text
    let userInput = prompt("Enter your desired new text", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
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
    // And now, as we added id property, we not only send request to our server with info what text should be updated
    // But also send the id of document which we want to be updated
    // With following syntax e.target.getAttribute("attributeName") we get the value of chosen html element attribute
    // This text and id are the names which we later use when accessing req.body for example req.body.text or req.body.id
    if (userInput) {
      axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
        // do something interesting here in the next video
        // As we are in our next video now, here we will write the code which will update the todo list on the fly
        // We write it here because this function is triggered after post method is complete that means, after changes are made to database
        // I think I got that right
        // Yep I got it right!
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
      }).catch(function() {
        console.log("Please try again later")
      })
    }
  }
})