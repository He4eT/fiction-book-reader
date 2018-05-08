import './css/style.css'

import { FictionReader } from './fictionReader'

let appendToEl = el => html =>
  el.insertAdjacentHTML('beforeend', html)

let hideEl = id => () =>
  document.getElementById(id).style.display = 'none'

let getFileFromInput = inputId => {
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


let convertBookToText = book => {
  let content = book.getTableOfContents()

  let textSections = content
    .map(section => section.textContent)

  return textSections
    .reduce((res, section) =>
      res + textSections)
}

let renderBook = domId => text => {
  let el = document.getElementById(domId)
  appendToEl(el)(text)
}

getFileFromInput('bookInput')
.then(convertFileToBook)
.then(convertBookToText)
.then(renderBook('book'))
.then(hideEl('controls'))