const bookList = document.querySelector('.book-list');
const addBookButton = document.querySelector('.add-book-button');
const addBookModal = document.querySelector('dialog');
const closeBookForm = document.querySelector('.close-book-form');
const addBookForm = document.querySelector('.add-book-form');
const changeLayoutButton = document.querySelector('.change-layout');
const deleteBookButtons = document.getElementsByClassName('delete-book');
const toggleReadButons = document.getElementsByClassName('toggle-read');

const editBookButtons = document.getElementsByClassName('edit-book');
const editBookModal = document.querySelector('.edit-book-modal');
const editBookForm = document.querySelector('.edit-book-form');
const closeEditBookForm = document.querySelector('.close-edit-book-form');

const title = document.querySelector('#book-title');
const author = document.querySelector('#book-author');
const rating = document.querySelector('#book-rating');
const read = document.querySelector('#book-read');
const image = document.querySelector('#book-image');

const editTitle = document.querySelector('#book-title-edit');
const editAuthor = document.querySelector('#book-author-edit');
const editRating = document.querySelector('#book-rating-edit');
const editRead = document.querySelector('#book-read-edit');
const editImage = document.querySelector('#book-image-edit');

const notifBanner = document.getElementById('notification-banner');

const myLibrary = [];

let displayMode = 'grid';

// Event listeners
addBookButton.addEventListener('click', () => {
    addBookModal.showModal();
})

closeEditBookForm.addEventListener('click', () => {
    closeEditModal();
})

closeBookForm.addEventListener('click', () => {
    closeModal();
})

changeLayoutButton.addEventListener('click', () => {
    toggleLayout();
})

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
}, true)

editBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    editBook();
}, true)

bookList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-book')) {
        deleteBook(e.target.dataset.id);
    }
    if (e.target.classList.contains('edit-book')) {
        showEditBookModal(e.target.dataset.id);
    }
    if (e.target.classList.contains('toggle-read')) {
        const book = myLibrary.find(b => b.id == e.target.dataset.id);
        if (book) book.toggleRead();
    }
});

// Object

function Book(title, author, read = false, rating = 0, image = '') {
    this.id = crypto.randomUUID();;
    this.title = title;
    this.author = author;
    this.rating = Math.min(5, Math.max(0, Number(rating)));;
    this.read = read;
    this.image = image;
}

Book.prototype.isRead = function () {
    return (this.read) ? `<i data-id="${this.id}" class="toggle-read fa-solid fa-check fa-xl" style="color: green;"></i>` : `<i data-id="${this.id}" class="toggle-read fa-solid fa-xmark fa-xl" style="color: red;"></i>`;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
    saveLibrary();
    refreshBookList();
}

Book.prototype.getRating = function () {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        if (i < this.rating) {
            stars += `<i class="fa-solid fa-star orange-star"></i>`;
        } else {
            stars += `<i class="fa-solid fa-star"></i>`;
        }
    }
    return stars;
}

function displayAllBooks() {
    if (displayMode === 'table') {
        const table = document.createElement('table');
        table.classList.add('table');
        const content = `
            <thead>
                <tr>
                    <th scope="col">&nbsp</th>
                    <th scope="col" class="title-col">Title</th>
                    <th scope="col" class="author-col">Author</th>
                    <th scope="col" class="rating-col">Rating</th>
                    <th scope="col" class="read-col">Read?</th>
                    <th scope="col" class="delete-col">&nbsp;</th>
                    <th scope="col class="edit-col"">&nbsp;</th>
                </tr>
            </thead>
            <tbody class="table-body"></tbody>
        `;
        table.innerHTML = content;
        bookList.appendChild(table);
    }

    myLibrary.forEach((book) => {
        displayBook(book);
    })

    getTableRows();
}

function toggleLayout() {
    if (displayMode === 'grid') {
        displayMode = 'table';
    } else if (displayMode == 'table') {
        displayMode = 'grid';
    }
    refreshBookList();
}

function gridLayout(book) {
    bookList.classList.add('book-list-grid');
    bookList.classList.remove('book-list-table');
    const bookCard = document.createElement('article');
    bookCard.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url("${book.image}")`;
    bookCard.classList.add('book-card');
    bookCard.dataset.id = book.id;
    const content = `
                <header class="article-header">
                    <div class="article-header-item article-header-title">
                        <h2 class="book-title">${book.title}</h2>
                        <h3 class="book-author">${book.author}</h3>
                    </div>
                    <div class="article-header-item article-header-read">
                        ${book.isRead()}
                    </div>
                </header>
                <div class="book-content">
                    ${book.getRating()}
                </div>
                <button type="button" class="delete-book" data-id="${book.id}"></button>
                <!--<button type="button" class="toggle-read" data-id="${book.id}">Toggle read</button>-->
                <button type="button" class="edit-book" data-id="${book.id}"></button>
    `;
    bookCard.innerHTML = content;
    bookList.appendChild(bookCard);
}

function tableLayout(book) {
    bookList.classList.remove('book-list-grid');
    bookList.classList.add('book-list-table');
    const tableRow = document.createElement('tr');
    const table = document.querySelector('.table-body');
    const content = `
        <th class="row-header" scope="row"></th>
        <td class="title-col">${book.title}</td>
        <td class="author-col">${book.author}</td>
        <td class="rating-col">${book.getRating()}</td>
        <td class="read-col">${book.isRead()}</td>
        <td class="delete-col"><button type="button" class="delete-book" data-id="${book.id}"></button></td>
        <td class="edit-col"><button type="button" class="edit-book" data-id="${book.id}"></button></td>
    `;
    tableRow.innerHTML = content;
    table.appendChild(tableRow);
}

function getTableRows() {
    const tableRows = document.querySelectorAll('.row-header');
    for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].textContent = i + 1;
    }
}

function displayBook(book) {
    if (displayMode === 'grid') {
        gridLayout(book);
    } else if (displayMode == 'table') {
        tableLayout(book);
    }
}

function refreshBookList() {
    while (bookList.firstChild) {
        bookList.removeChild(bookList.lastChild);
    }
    displayAllBooks()
}

// Edit books
function showEditBookModal(book) {
    editBookModal.showModal();
    const find = myLibrary.find(b => b.id == book);
    const form = editBookModal.querySelector('.edit-book-form');
    form.dataset.id = find.id;
    if (find) {
        editTitle.value = find.title;
        editAuthor.value = find.author;
        editRating.value = find.rating;
        editRead.checked = find.read;
        editImage.value = find.image;
    }
}

function editBook(e) {
    const form = editBookModal.querySelector('.edit-book-form');
    const book = myLibrary.find(b => b.id == form.dataset.id);
    if (book) {
        book.title = editTitle.value;
        book.author = editAuthor.value;
        book.rating = editRating.value;
        book.read = editRead.checked;
        book.image = editImage.value;
    }
    closeEditModal();
    notification('edit')
    saveLibrary();
    refreshBookList();
}

function closeEditModal() {
    editTitle.value = '';
    editAuthor.value = '';
    editRating.value = '';
    editRead.checked = false;
    editImage.value = '';
    editBookModal.close();
}

// Add books
function closeModal() {
    title.value = '';
    author.value = '';
    rating.value = '';
    read.checked = false;
    image.value = '';
    addBookModal.close();
}

function addBook(e) {
    const newBook = new Book(title.value, author.value, read.checked, rating.value, image.value);
    const index = myLibrary.findIndex(b => b.title.toLowerCase() == title.value.toLowerCase());
    if (index < 0) {
        myLibrary.push(newBook);
        notification('add');
        closeModal();
        saveLibrary();
        refreshBookList();
    } else {
        notification('duplicate');
    }
}

function addBookToLibrary(title, author, read, rating, image) {
    const book = new Book(title, author, read, rating, image);
    myLibrary.push(book);
}

function deleteBook(book) {
    const index = myLibrary.findIndex(b => b.id == book);
    if (index >= 0) {
        myLibrary.splice(index, 1);
    }
    notification('delete');
    saveLibrary();
    refreshBookList();
}

// Notifications
function notification(activity) {
    notifBanner.style.display = 'none';
    notifBanner.textContent = '';
    let message = '';
    let color = '';
    switch (activity) {
        case 'add':
            message = 'Succesfully added';
            color = 'green';
            break;
        case 'duplicate':
            message = 'Duplicate book added';
            color = 'red';
            break;
        case 'delete':
            message = 'Book removed!';
            color = 'green';
            break;
        case 'edit':
            message = 'Book updated!';
            color = 'green';
            break;
        default:
            return;
    }

    void notifBanner.offsetWidth;

    notifBanner.textContent = message;
    notifBanner.style.backgroundColor = color;
    notifBanner.style.display = 'block';

    setTimeout(() => {
        notifBanner.style.display = 'none';
    }, 3000);
}

// local storage
function saveLibrary() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function loadLibrary() {
    const data = JSON.parse(localStorage.getItem('myLibrary')) || [];
    myLibrary.length = 0; // clear current
    data.forEach(b => myLibrary.push(new Book(b.title, b.author, b.read, b.rating, b.image)));
}

addBookToLibrary('Wasp Factory', 'Iain M Banks', true, 4, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1434940562i/567678.jpg');
addBookToLibrary('Dune', 'Frank Herbert', true, 3, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg');
addBookToLibrary('The Magus', 'John Fowles', false, 0, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1441323311i/16286.jpg');
addBookToLibrary('Prophet Song', 'Rachel Morris', false, 2, 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1689541792i/158875813.jpg');
addBookToLibrary('Homo Deus', 'Rachel Morris');

loadLibrary();
displayAllBooks();

// Display total number of books, and total read
// Add favourite icon
// Ability to sort books
// Hook up to API to download images and other metadata
// DONE prevent duplicate books being added
// Add alert banner for successfully added, duplicated prevented, etc