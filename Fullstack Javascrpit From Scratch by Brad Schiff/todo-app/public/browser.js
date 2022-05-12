function itemTemplate(item) {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
}

// Create Feature
// We will need work with input element more than once so instead of repeatedly selecting that element
// We will create the variable that will point towards it and then we can reuse that variable
// Cool, now we can reuse this variable, whenever we want to work with the element
let createField = document.getElementById("create-field")

// We need to write browser based javascript to detect the submit event for that create form
// We want begin by selecting the html form element
// Here we look for submit event and not click cuz well there are multiple ways to submit the form
// For example by clicking the submit button or pressing on Enter or Return key
// As submit event listener will take care of either of this events, it is perfect for this case
// And well the second arg is function which will execute after this event happens, I guess I finally will remember this :d
// Drill Gocha again and again, the e arg in this function will contain all sorts of information about the event that just took the place
document.getElementById("create-form").addEventListener("submit", function(e) {
  // Here we prevent the default behavior of the web browser
  // Meaning, we don't want to actually send the traditional request to the web server
  e.preventDefault()
  
  // So now we just wanna use javascript to extract whatever value the user had typed in and then use axios
  // To send async request to the node server
  // We know that now  the node server is sending back data as its response
  // And axios makes it very easy to access that data
  // We added the response param to the anonym function, it is the server response back to the browser
  // Now we will pass to the template function the little bit of data
  axios.post('/create-item', {text: createField.value}).then(function(response) {
    // Create the html for a new item
    // This line of code is what actually will run, once our server responds
    // We want to create new list item and add it to the bottom of the ul
    // But before we set that up, we should adjust what our node app or express does when it receives the post request to /create-item url
    // Here we selected the ul and once we did it we called a method on it .insertAdjacentHTML()
    // We give this method two args, first arg is, where we want to add the new html
    // We pass the string of "beforeend", there are several strings, this one indicates right before the closing ul tag
    // And the second arg is the html we actually want to add
    // We will add function as the second arg which will pass the html we want to add, we do it like this
    // Because we don't want to make this line really long and unreadable
    // We passed to itemTemplate() function the response.data and that will access that js object
    // That represents the newest document in the database that the server is sending back to our browser
    // 
    document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
    createField.value = ""
    createField.focus()
  }).catch(function() {
    console.log("Please try again later.")
  })
})

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