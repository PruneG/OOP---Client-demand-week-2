class Library {
    constructor(name) {
        this.name = name;
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    removeBook(isbn) {
        this.books = this.books.filter(book => book.isbn !== isbn);
    }

    findBook(title) {
        return this.books.find(book => book.title.toLowerCase() === title.toLowerCase());
    }

    listBooks() {
        return this.books.map(book => `${book.title} by ${book.author}`);
    }

    getBookCount() {
        return this.books.length;
    }
}

class Book {
    constructor(title, author, isbn, year) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
    }
}

module.exports = { Library, Book };