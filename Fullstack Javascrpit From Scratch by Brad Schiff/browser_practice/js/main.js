let to_do_form = document.getElementById("to_do_form")
let to_do_field = document.getElementById("to_do_field")
let to_do_list = document.getElementById("to_do_list")

to_do_form.addEventListener("submit", (e) => {
  e.preventDefault()
  createItem(to_do_field.value)
  to_do_field.value = ""
  to_do_field.focus()
})

function createItem(x) {
  let to_do_html = `<li>${x} <button onclick="deleteItem(this)">Delete</button></li>`
  to_do_list.insertAdjacentHTML("beforeend", to_do_html)
}

function deleteItem(elementToDelete) {
  elementToDelete.parentElement.remove()
}