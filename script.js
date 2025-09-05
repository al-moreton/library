const bookList = document.querySelector('.book-list');
const addBookButton = document.querySelector('.add-book-button');
const addBookModal = document.querySelector('dialog');
const closeBookForm = document.querySelector('.close-book-form');
const addBookForm = document.querySelector('.add-book-form');
const deleteBookButtons = document.getElementsByClassName('delete-book');
const toggleReadButons = document.getElementsByClassName('toggle-read');

const title = document.querySelector('#book-title');
const author = document.querySelector('#book-author');
const pages = document.querySelector('#book-pages');
const read = document.querySelector('#book-read');

addBookButton.addEventListener('click', () => {
    addBookModal.showModal();
})

closeBookForm.addEventListener('click', () => {
    closeModal();
})

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
}, true)

const myLibrary = [];

function Book(title, author, pages) {
    this.id = this.id = crypto.randomUUID();;
    this.title = title;
    this.author = author;
    this.pages = Number(pages);
    this.read = false;
}

Book.prototype.isRead = function () {
    return (this.read) ? 'Has been read' : 'Not read yet';
}

Book.prototype.toggleRead = function() {
    if (this.read) {
        this.read = false;
    } else if (!this.read) {
        this.read = true;
    }
    refreshBookList();
}

function addBookToLibrary(title, author, pages) {
    const book = new Book(title, author, pages);
    myLibrary.push(book);
}

function displayAllBooks() {
    myLibrary.forEach((book) => {
        displayBook(book);
    })

    for (let i = 0; i < deleteBookButtons.length; i++) {
        deleteBookButtons[i].addEventListener('click', (e) => {
            deleteBook(e.target.dataset.id);
        })
    }

    for (let i = 0; i < toggleReadButons.length; i++) {
        toggleReadButons[i].addEventListener('click', (e) => {
            const book = myLibrary.find(b => b.id == e.target.dataset.id);
            if (book) {
                book.toggleRead();
            }
        })
    }
}

function displayBook(book) {
    const bookCard = document.createElement('article');
    bookCard.classList.add('book-card');
    bookCard.dataset.id = book.id;
    const content = `
                <header>
                    <h2 class="book-title">${book.title}</h2>
                    <h3 class="book-author">${book.author}</h3>
                </header>
                <ul class="book-content">
                    <li>${book.pages} pages</li>
                    <li>${book.isRead()}</li>
                </ul>
                <button type="button" class="delete-book" data-id="${book.id}">Delete</button>
                <button type="button" class="toggle-read" data-id="${book.id}">Toggle read</button>
    `;
    bookCard.innerHTML = content;
    bookList.appendChild(bookCard);
}

function closeModal() {
    title.value = '';
    author.value = '';
    pages.value = '';
    read.checked = false;
    addBookModal.close();
}

function addBook(e) {
    const newBook = new Book(title.value, author.value, pages.value, read.checked);
    myLibrary.push(newBook);
    closeModal();
    refreshBookList();
}

function refreshBookList() {
    while (bookList.firstChild) {
        bookList.removeChild(bookList.lastChild);
    }
    displayAllBooks()
}

function deleteBook(book) {
    // this isn't working
    const index = myLibrary.findIndex(b => b.id == book);
    if (index >= 0) {
        myLibrary.splice(index, 1);
    }
    refreshBookList();
}

addBookToLibrary('Wasp Factory', 'Iain M Banks', 435);
addBookToLibrary('Dune', 'Frank Herbert', 765);
addBookToLibrary('The Magus', 'John Fowles', 378);
addBookToLibrary('Prophet Song', 'Rachel Morris', 378);

displayAllBooks();