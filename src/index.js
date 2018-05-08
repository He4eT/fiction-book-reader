import './css/style.css'

import { FictionReader } from './fictionReader'

let appendToEl = el => html =>
  el.insertAdjacentHTML('beforeend', html)

let createInitialMarkup = () => {
  let initialHtml = `
    <div class='content'>
      <div id='controls'>
        <input type='file' id='bookInput'>
      </div>
      <div id='book'></div>
    </div>`

  appendToEl(document.body)(initialHtml)
}

let getBookFileFromInput = inputId => {
  let input = document.getElementById(inputId)
  
  return new Promise((resolve, reject) => {
    input.addEventListener('change', function () {
      let file = this.files[0]
      let reader = new FileReader()
      reader.readAsText(file)

      reader.onload = function () {
        let parser = new DOMParser()
        let booksrc = parser.parseFromString(
          reader.result, 'application/xml')
        resolve(booksrc)
      }
    }, false)
  })
}

let convertFileToBook = file =>
  new FictionReader(file)

let bookToDOM = domId => book => {
  let content = book.getTableOfContents()
  let el = document.getElementById(domId)

  content
    .map(section => section.textContent)
    .forEach(appendToEl(el))
}

let hideEl = id => () =>
  document.getElementById(id).style.display = 'none'

createInitialMarkup()

getBookFileFromInput('bookInput')
.then(convertFileToBook)
.then(bookToDOM('book'))
.then(hideEl('controls'))