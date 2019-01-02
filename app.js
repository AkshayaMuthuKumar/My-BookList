class Book {
  constructor(title,author,isbn,stars,description) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.stars=stars;
    this.description = description;
  }
}

  class UI {
  static displayBooks() {
    const books=Store.getBooks();
    books.forEach((book)=> UI.addBookToList(book));
  }
  
  static addBookToList(book) {
    const list =document.querySelector('#book-list');
    const row =document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.stars}</td>
      <td>${book.description}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  }
  static deleteBook(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className=`alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container=document.querySelector('.container');
    const form=document.querySelector('#book-form');
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
    document.querySelector('.stars').value = '';
    document.querySelector('#description').value = '';
  }
}
  class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } 
    else {
      books=JSON.parse(localStorage.getItem('books'));
  }
  return books;
  }

  static addBook(book) {
    const books=Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books=Store.getBooks();
    books.forEach((book, index) => {
      if(book.isbn===isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
document.addEventListener('DOMContentLoaded', function(){
  let stars = document.querySelectorAll('.star');
  stars.forEach(function(star){
      star.addEventListener('click', setRating); 
  });
  
  let rating = parseInt(document.querySelector('.stars').getAttribute('data-rating'));
  let target = stars[rating - 1];
  target.dispatchEvent(new MouseEvent('click'));
});

function setRating(ev){
  let span = ev.currentTarget;
  let stars = document.querySelectorAll('.star');
  let match = false;
  let num = 0;
  stars.forEach(function(star, index){
      if(match){
          star.classList.remove('rated');
      }else{
          star.classList.add('rated');
      }
      //are we currently looking at the span that was clicked
      if(star === span){
          match = true;
          num = index + 1;
      }
  });
  document.querySelector('.stars').setAttribute('data-rating', num);
}

// Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;
  const stars=  document.querySelector('.stars').value;
  const description = document.querySelector('#description').value;

  // Validate
  if(title ===''||author===''||isbn===''||stars===''||description==='') {
    UI.showAlert('Please fill in all fields','danger');
  } 
  else {
    // Instatiate book
    const book = new Book(title,author,isbn,stars,description);
    // Add Book to UI
    UI.addBookToList(book);
    // Add book to store
    Store.addBook (book);
    UI.showAlert('Book Added', 'success');

    UI.clearFields ();
  }
});
//  Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
  // Remove book from UI
  UI.deleteBook(e.target);
  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  UI.showAlert('Book Removed', 'success');
});

