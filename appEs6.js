class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');

    //create tr element
    const row = document.createElement('tr');

    //insert cols
    row.innerHTML = `
  <td> ${book.title} </td>
  <td> ${book.author} </td>
  <td> ${book.isbn} </td>
  <td><a href = "#" class="delete"> X </a> </td>`;

    list.appendChild(row);

  }

  showAlert(message, className) {

    //create div
    const div = document.createElement('div');
    //Add classes
    div.className = `alert ${className}`;
    //Add text
    div.appendChild(document.createTextNode(message));
    //get a parent
    const container = document.querySelector('.container');

    //get form
    const form = document.querySelector('#book-form');

    //insert alert
    container.insertBefore(div, form);
    //time out
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFeilds() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

//local storage class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function(book){
      const ui = new UI;

      //add book to UI
      ui.addBookToList(book);
    });
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));

  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index){
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}
// dom load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
//event listener for add book
document.getElementById('book-form').addEventListener('submit', function (e) {

  //get form values
  const title = document.getElementById('title').value,
    author = document.getElementById('author').value,
    isbn = document.getElementById('isbn').value;

  //instance of a book
  const book = new Book(title, author, isbn);

  //instatiate UI
  const ui = new UI();

  //validate 
  if (title === '' || author === '' || isbn === '') {
    //error alert
    ui.showAlert('Please Fill in all Feilds', 'error');
  } else {

    //add book to list
    ui.addBookToList(book);

    //Add to local storage
    Store.addBook(book);

    //show success
    ui.showAlert('Book Added!', 'success')

    //ui clear feilds
    ui.clearFeilds();

  }

  e.preventDefault();
});

//event listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  //instatiate UI
  const ui = new UI();

  // delete book
  ui.deleteBook(e.target);

  //remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show message
  ui.showAlert('Book Removed!', 'success');

  e.preventDefault();
})