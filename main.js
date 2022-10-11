const STORAGE_KEY = "BOOKSHELF_APPS"
let books = []

const isStorageDefined = () => {
    const storage = typeof (Storage) !== undefined
    if (!storage) alert("Browser Anda tidak mendukung local storage")

    return storage
}

const createBookView = ({id, title, author, release_year, is_complete = false}) => {
    const render_complete = is_complete ? 'Belum ' : ''
    const article = document.createElement('article')
    article.classList.add('book_item')
    article.setAttribute('data-id', id)

    article.innerHTML = (
        `<div class="book_info">
            <h3>${title} (${release_year})</h3>
            <p>${author}</p>
        </div>
        <div class="button_container">
            <button class="green_button" onclick="toggleComplete(${id})">${render_complete}Selesai</button>
            <button class="red_button" onclick="removeBook(${id})">Hapus</button>
        </div>`
    )

    return article
}

const removeBooksView = () => {
    document.querySelectorAll('.book_item').forEach((book_item) => {
        book_item.remove()
    })
}

const renderBook = (book) => {
    const incomplete_shelf = document.getElementById('incompleteBookshelfList')
    const complete_shelf   = document.getElementById('completeBookshelfList')
    const bookshelf        = book.is_complete ? complete_shelf : incomplete_shelf

    bookshelf.append(createBookView(book))
}

const renderBooksView = () => {
    removeBooksView()
    for (let book of books) {
        renderBook(book)
    }
}

const saveBooks = () => {
    const books_stringify = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, books_stringify)

    renderBooksView()
}

const getBooksFromStorage = () => {
    const books_raw = localStorage.getItem(STORAGE_KEY)
    const books_parsed = JSON.parse(books_raw)

    if (books_parsed !== null) books = books_parsed;

    renderBooksView()
}

const addBook = ({ title, author, release_year, is_complete, id = null }) => {
    const book = {
        id: id ?? (new Date()).getTime(),
        title,
        author,
        release_year,
        is_complete,
    }

    books.push(book)
    saveBooks()
}

const getBook = (id) => {
    for (let book of books) {
        if (book.id === id) return book
    }

    return null
}

const getBookIndex = (id) => {
    let index = 0
    for (let book of books) {
        if (book.id === id) return index

        index = index + 1
    }

    return -1;
}

const toggleComplete = (id) => {
    const book = getBook(id)
    const position = getBookIndex(id)
    books.splice(position, 1)

    book.is_complete = !book.is_complete

    addBook(book)
}

const removeBook = (id) => {
    const confirmation = confirm('Apakah Anda yakin menghapus buku ini dari rak?')
    if (!confirmation) return;

    const position = getBookIndex(id)
    books.splice(position, 1)
    
    saveBooks()
}

if (isStorageDefined()) getBooksFromStorage()

document.getElementById("inputBook").addEventListener("submit", (event) => {
    event.preventDefault()

    addBook({
        title: document.querySelector("#inputBookTitle").value,
        author: document.querySelector("#inputBookAuthor").value,
        release_year: document.querySelector("#inputBookYear").value,
        is_complete: document.querySelector("#inputBookIsComplete").checked
    })

    document.querySelector('#bookReset').click()
})