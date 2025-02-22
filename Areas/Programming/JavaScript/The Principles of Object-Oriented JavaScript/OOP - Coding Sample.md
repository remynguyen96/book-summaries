### Create a function with Object.create

![function_with_Object.create_1.png](function_with_Object.create_1.png)

![function_with_Object.create_2.png](function_with_Object.create_2.png)

```js
const bookData = {
    title: 'Pride and Prejudice',
    author: 'Emily Bronté',
    quantity: 3,
    edition: 4
}

const comicBookData = {
    title: 'Spiderman',
    author: 'Stan Lee',
    quantity: 3,
    graphicArtist: 'Todd McFarlane'
}

// Your code goes here
function Book(title, author, quantity, edition) {
    this.title = title;
    this.author = author;
    this.quantity = quantity;
    this.edition = edition;
}

Object.defineProperty(Book, 'setEdition', {
    value: function (newEdition) {
        this.edition = newEdition
    }
});

Book.prototype.sell = function () {
    if (this.quantity > 0) {
        this.quantity -= 1;
    }
}

function ComicBook(title, author, quantity, graphicArtist) {
    Book.call(this, title, author, quantity);
    this.graphicArtist = graphicArtist;
}

ComicBook.prototype = Object.create(Book.prototype, {
  constructor: {
    value: ComicBook
  }
});

const book = new Book(bookData.title, bookData.author, bookData.quantity, bookData.edition);
const comicBook = new ComicBook(comicBookData.title, comicBookData.author, comicBookData.quantity, comicBookData.graphicArtist);
const result = [book, comicBook];

// Your code returned:
[
  Book {
    title: 'Pride and Prejudice',
    author: 'Emily Bronté',
    quantity: 2,
    edition: 5
  },
  ComicBook {
    title: 'Spiderman',
    author: 'Stan Lee',
    quantity: 3,
    graphicArtist: 'Todd McFarlane'
  }
]
```

### Private Properties

![private_properties_instruction_1](private_properties_instruction_1.png)

![private_properties_instruction_1](private_properties_instruction_2.png)

```js
const userData = {
    username: 'emma',
    password: 'ZRYAK3GSS3wQujr'
};

const adminData = {
    username: 'sarah',
    password: 'r5tHZE9DUP1SgTB'
}

const userToDelete = 'carter'

// Your code goes here
class User {
    #password;

    constructor(username, password) {
        this.username = username;
        this.#password = password;
    }

    #updatePassword(newPassword) {
        this.#password = newPassword;
    }

    resetPassword(newPassword) {
        this.#updatePassword(newPassword);
        return 'Your password has been updated';
    }
}

class Admin extends User {
    constructor(username, password) {
        super(username, password)
        this.isAdmin = true;
    }

    deleteUser(userToDelete) {
        return `The user ${userToDelete} has been deleted`
    }
}

const result= [
    new User(userData.username, userData.password),
    new Admin(adminData.username, adminData.password)
]

// Your code returned:
[
  User { username: 'emma' },
  Admin { username: 'sarah', isAdmin: true }
]
```