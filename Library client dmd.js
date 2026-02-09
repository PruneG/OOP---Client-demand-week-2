class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;

    this.isAvailable = true;
    this.borrowedBy = null;      // membre
    this.reservationQueue = [];  // tableau de membres
  }
}

class Library {
  constructor(name) {
    this.name = name;
    this.books = [];
    this.members = [];

    // règles (admin peut changer)
    this.maxLoansPerMember = 3;
    this.finePerLateDay = 1;
  }

  addBook(book) {
    this.books.push(book);
  }

  registerMember(member) {
    this.members.push(member);
  }

  findBookByTitle(title) {
    return this.books.find(b => b.title.toLowerCase() === title.toLowerCase());
  }

  findBookByIsbn(isbn) {
    return this.books.find(b => b.isbn === isbn);
  }
}class LibraryMember {
  constructor(name) {
    this.name = name;
    this.borrowedBooks = [];
    this.fines = 0;
  }
}
class Librarian {
  constructor(name, library) {
    this.name = name;
    this.library = library;
  }

  borrowBook(member, book) {
    if (!book) return console.log("Book not found.");
    if (member.borrowedBooks.length >= this.library.maxLoansPerMember) {
      return console.log(`${member.name} reached the borrowing limit.`);
    }

    // si le livre est réservé par quelqu’un d’autre
    if (book.reservationQueue.length > 0 && book.reservationQueue[0] !== member) {
      return console.log(`"${book.title}" is reserved for someone else.`);
    }

    if (!book.isAvailable) return console.log(`"${book.title}" is not available.`);

    book.isAvailable = false;
    book.borrowedBy = member;
    member.borrowedBooks.push(book);

    // s’il était premier dans la queue, on l’enlève
    if (book.reservationQueue[0] === member) book.reservationQueue.shift();

    console.log(`${member.name} borrowed "${book.title}"`);
  }

  returnBook(member, book) {
    if (!book) return console.log("Book not found.");
    if (book.borrowedBy !== member) return console.log("This member didn't borrow this book.");

    book.isAvailable = true;
    book.borrowedBy = null;
    member.borrowedBooks = member.borrowedBooks.filter(b => b !== book);

    console.log(`${member.name} returned "${book.title}"`);

    // notification simple si quelqu'un a réservé
    if (book.reservationQueue.length > 0) {
      const nextMember = book.reservationQueue[0];
      console.log(`Notify ${nextMember.name}: "${book.title}" is now available.`);
    }
  }

  reserveBook(member, book) {
    if (!book) return console.log("Book not found.");

    // éviter doublons
    if (book.reservationQueue.includes(member)) {
      return console.log(`${member.name} already reserved "${book.title}".`);
    }

    // si dispo -> tu peux dire “emprunte direct” ou “réservé”
    if (book.isAvailable) {
      console.log(`"${book.title}" is available — you can borrow it now.`);
      return;
    }

    book.reservationQueue.push(member);
    console.log(`${member.name} reserved "${book.title}" (position ${book.reservationQueue.length})`);
  }
}
class LibraryAssistant {
  constructor(name, library) {
    this.name = name;
    this.library = library;
  }

  addNewBook(title, author, isbn) {
    const book = new Book(title, author, isbn);
    this.library.addBook(book);
    console.log(`${this.name} added "${title}" to the catalog.`);
  }
}
class Administrator {
  constructor(name, library) {
    this.name = name;
    this.library = library;
  }

  setBorrowLimit(n) {
    this.library.maxLoansPerMember = n;
    console.log(`Policy updated: maxLoansPerMember = ${n}`);
  }

  setFinePerDay(amount) {
    this.library.finePerLateDay = amount;
    console.log(`Policy updated: finePerLateDay = ${amount}`);
  }
}
const lib = new Library("City Library");

const admin = new Administrator("Admin", lib);
admin.setBorrowLimit(2);

const librarian = new Librarian("Sarah", lib);
const assistant = new LibraryAssistant("Tom", lib);

const prune = new LibraryMember("Prune");
const irfan = new LibraryMember("Irfan");

lib.registerMember(prune);
lib.registerMember(irfan);

assistant.addNewBook("1984", "George Orwell", "111");
assistant.addNewBook("Dune", "Frank Herbert", "222");

const dune = lib.findBookByTitle("Dune");

librarian.borrowBook(prune, dune);
librarian.reserveBook(irfan, dune);
librarian.returnBook(prune, dune); // doit notifier Irfan
librarian.borrowBook(irfan, dune);

console.log("✅ Le fichier s'exécute !");