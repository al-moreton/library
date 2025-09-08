const bookList = document.querySelector('.book-list');
const addBookButton = document.querySelector('.add-book-button');
const addBookModal = document.querySelector('dialog');
const closeBookForm = document.querySelector('.close-book-form');
const addBookForm = document.querySelector('.add-book-form');
const changeLayoutButton = document.querySelector('.change-layout');
const sortSelect = document.getElementById('book-sort');
const searchFilter = document.getElementById('book-filter');
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
let currentLayout = myLibrary;

let displayMode = 'grid';

// Event listeners
addBookButton.addEventListener('click', () => {
    addBookModal.showModal();

    highlightStars('add-star-rating');

    addBookModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-star-rating')) {
            const stars = document.getElementsByClassName('add-star-rating');
            for (let i = 0; i < stars.length; i++) {
                stars[i].classList.remove('orange-star');
            }
            for (let i = 0; i < e.target.dataset.rating; i++) {
                stars[i].classList.add('orange-star');
            }
            rating.value = e.target.dataset.rating;
        }
    })
})

closeEditBookForm.addEventListener('click', () => {
    closeEditModal();
})

closeBookForm.addEventListener('click', () => {
    closeModal();
})

//move toggle layout into refreshlist
changeLayoutButton.addEventListener('click', () => {
    toggleLayout();
})

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addBook();
}, true)

searchFilter.addEventListener('input', (e) => {
    filterBooks(e.target.value);
}, true)

editBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    editBook();
}, true)

sortSelect.addEventListener('change', (e) => {
    sortBooks(e.target.value);
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
    if (e.target.classList.contains('star-rating')) {
        updateRating(e.target.dataset.id, e.target.dataset.rating);
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
            stars += `<i data-id="${this.id}" data-rating="${i + 1}" class="star-rating fa-solid fa-star orange-star"></i>`;
        } else {
            stars += `<i data-id="${this.id}" data-rating="${i + 1}" class="star-rating fa-solid fa-star"></i>`;
        }
    }
    return stars;
}

function filterBooks(str) {
    currentLayout = myLibrary.filter(b =>
        b.title.toLowerCase().includes(str.toLowerCase()) ||
        b.author.toLowerCase().includes(str.toLowerCase())
    );
    refreshBookList(currentLayout);
}

function sortBooks(method) {
    switch (method) {
        case 'title-asc':
            currentLayout.sort((a, b) => {
                const bookA = a.title.toUpperCase();
                const bookB = b.title.toUpperCase();
                if (bookA < bookB) {
                    return -1;
                }
                if (bookA > bookB) {
                    return 1;
                }
                return 0;
            })
            break;
        case 'title-desc':
            currentLayout.sort((a, b) => {
                const bookA = a.title.toUpperCase();
                const bookB = b.title.toUpperCase();
                if (bookA < bookB) {
                    return 1;
                }
                if (bookA > bookB) {
                    return -1;
                }
                return 0;
            })
            break;
        case 'rating':
            currentLayout.sort((a, b) => {
                const bookA = a.rating;
                const bookB = b.rating;
                return bookB - bookA;
            })
            break;
        case 'read':
            currentLayout.sort((a, b) => {
                const bookA = a.read;
                const bookB = b.read;
                return bookA - bookB;
            })
            break;
        default:
            return;
    }

    refreshBookList();
}

function highlightStars(css) {
    const stars = document.getElementsByClassName(css);
    for (let i = 0; i < stars.length; i++) {
        stars[i].addEventListener('mouseover', () => {
            for (x = 0; x < stars[i].dataset.rating; x++) {
                stars[x].classList.add('orange-star-hover');
            }
        })

        stars[i].addEventListener('mouseout', () => {
            for (x = 0; x < stars[i].dataset.rating; x++) {
                stars[x].classList.remove('orange-star-hover');
            }
        })
    }
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
    bookCard.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5)), url("${book.image}")`;
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
                    <div>
                        ${book.getRating()}
                    </div>
                    <button type="button" class="delete-book" data-id="${book.id}"></button>
                    <button type="button" class="edit-book" data-id="${book.id}"></button>
                </div>
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

function refreshBookList(list = currentLayout) {
    while (bookList.firstChild) {
        bookList.removeChild(bookList.lastChild);
    }

    if (list.length === 0) {
        bookList.innerHTML = "<p>No books found!</p>";
        return;
    }

    if (displayMode === 'table') {
        const table = document.createElement('table');
        table.classList.add('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">&nbsp</th>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Read?</th>
                    <th scope="col">&nbsp;</th>
                    <th scope="col">&nbsp;</th>
                </tr>
            </thead>
            <tbody class="table-body"></tbody>
        `;
        bookList.appendChild(table);
    }

    list.forEach(displayBook);

    if (displayMode === 'table') getTableRows();
}

// Edit books
function showEditBookModal(book) {
    editBookModal.showModal();
    highlightStars('edit-star-rating');
    const stars = document.getElementsByClassName('edit-star-rating');
    const find = myLibrary.find(b => b.id == book);
    const form = editBookModal.querySelector('.edit-book-form');
    form.dataset.id = find.id;
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('orange-star');
    }
    for (let i = 0; i < find.rating; i++) {
        stars[i].classList.add('orange-star');
    }
    editBookModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-star-rating')) {
            for (let i = 0; i < stars.length; i++) {
                stars[i].classList.remove('orange-star');
            }
            for (let i = 0; i < e.target.dataset.rating; i++) {
                stars[i].classList.add('orange-star');
            }
            editRating.value = e.target.dataset.rating;
        }
    })
    if (find) {
        editTitle.value = find.title;
        editAuthor.value = find.author;
        editRating.value = find.rating;
        editRead.checked = find.read;
        editImage.value = find.image;
    }
}

function updateRating(dataid, newRating) {
    const book = myLibrary.find(b => b.id == dataid);
    book.rating = Number(newRating);
    saveLibrary();
    refreshBookList();
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
    const stars = document.getElementsByClassName('edit-star-rating');
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('orange-star');
    }
    editBookModal.close();
}

// Add books
function closeModal() {
    title.value = '';
    author.value = '';
    rating.value = '';
    read.checked = false;
    image.value = '';
    const stars = document.getElementsByClassName('add-star-rating');
    for (let i = 0; i < stars.length; i++) {
        stars[i].classList.remove('orange-star');
    }
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
    myLibrary.length = 0;
    if (data.length === 0) {
        myLibrary.push(new Book(
            'Wasp Factory',
            'Iain Banks',
            false,
            4,
            'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1434940562i/567678.jpg'
        ));
        myLibrary.push(new Book(
            'Dune',
            'Frank Herbert',
            true,
            5,
            'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg'
        ));
        myLibrary.push(new Book(
            'The Magus',
            'John Fowles',
            true,
            3,
            'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1441323311i/16286.jpg'
        ));
        saveLibrary();
    } else {
        data.forEach(b => myLibrary.push(
            new Book(b.title, b.author, b.read, b.rating, b.image)
        ));
    }
}

loadLibrary();
refreshBookList();