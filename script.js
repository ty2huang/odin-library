const newBookBtn = document.querySelector('#newBookBtn');
const libraryDiv = document.querySelector('.books-div');
const templateCard = document.querySelector('.templates > .card')

const addBookModal = document.querySelector('#addBookModal');
const addBookForm = document.querySelector('#addBookForm');
const closeModalSpan = document.querySelector('.close');
const formTitle = document.querySelector('.form-title');
const titleIpt = document.querySelector('#titleInput');
const authorIpt = document.querySelector('#authorInput');
const numPagesIpt = document.querySelector('#numPagesInput');
const hasReadIpt = document.querySelector('#hasReadInput');

let bookToEdit = null;
let lastInsertIdx = 0;
let myLibrary = [];

function Book(title, author, numPages, haveRead) {
    this.title = null;
    this.author = null;
    this.numPages = null;
    this.haveRead = null;
    
    this.cardElement = templateCard.cloneNode(true);
    this.readToggle = this.cardElement.querySelector('.mark-read');
    this.cardElement.querySelector('.remove-btn').addEventListener('click', () => removeBookFromLibrary(this));
    this.cardElement.querySelector('.edit-btn').addEventListener('click', () => promptEditBook(this));
    this.readToggle.addEventListener('change', e => this.setReadStatus(e.target.checked));

    this.updateInfo(title, author, numPages, haveRead);
    this.insertIdx = (lastInsertIdx++);
}

Book.prototype.info = function() {
    let readTxt = haveRead ? 'have read' : 'not read yet';
    return `${title} by ${author}, ${numPages} pages, ${readTxt}`;
}

Book.prototype.updateInfo = function(title, author, numPages, haveRead) {
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.haveRead = haveRead;
    this.cardElement.querySelector('.title').textContent = this.title;
    this.cardElement.querySelector('.author').textContent = this.author;
    this.cardElement.querySelector('.num-pages').textContent = this.numPages;
    this.setReadStatus(this.haveRead);
}

Book.prototype.setReadStatus = function(readStatus) {
    this.haveRead = readStatus;
    this.readToggle.checked = readStatus;
    if (readStatus) 
        this.cardElement.style['background-color'] = 'azure';
    else
        this.cardElement.style['background-color'] = 'floralwhite';
}

function addBookToLibrary(title, author, numPages, haveRead) {
    book = new Book(title, author, numPages, haveRead)
    myLibrary.push(book);
    libraryDiv.appendChild(book.cardElement);
}

function removeBookFromLibrary(book) {
    book.cardElement.remove()
    const index = myLibrary.indexOf(book);
    if (index > -1) myLibrary.splice(index, 1);
}

function addSampleBook() {
    addBookToLibrary('1984', 'George Orwell', '328', false)
}

function displayBooks() {
    libraryDiv.innerHTML = ''
    for (const book of myLibrary) {
        libraryDiv.appendChild(book.cardElement)
    }
}

function showBookModal() {
    addBookModal.style.display = 'block';
    if (bookToEdit === null)
        formTitle.textContent = 'Add New Book';
    else
        formTitle.textContent = 'Edit Book'
}

function clearFields() {
    titleIpt.value = '';
    authorIpt.value = '';
    numPagesIpt.value = '';
    hasReadIpt.checked = false;
}

function hideModal() {
    clearFields();
    addBookModal.style.display = 'none';
    bookToEdit = null;
}

function handleModalClicks(event) {
    // Hides modal if click on background
    if (event.target == addBookModal) {
        hideModal();
    } 
}

function promptEditBook(book) {
    bookToEdit = book;
    showBookModal();
    titleIpt.value = book.title;
    authorIpt.value = book.author;
    numPagesIpt.value = book.numPages;
    hasReadIpt.checked = book.haveRead;
}

function submitBook(event) {
    event.preventDefault();
    let title = titleIpt.value;
    let author = authorIpt.value;
    let numPages = numPagesIpt.value;
    let hasRead = hasReadIpt.checked;
    if (bookToEdit === null)
        addBookToLibrary(title, author, numPages, hasRead);
    else {
        bookToEdit.updateInfo(title, author, numPages, hasRead);
        bookToEdit = null;
    }
    hideModal();
}

addSampleBook()
newBookBtn.addEventListener('click', showBookModal);
closeModalSpan.addEventListener('click', hideModal);
addBookModal.addEventListener('mousedown', handleModalClicks);
addBookForm.addEventListener('submit', submitBook);
