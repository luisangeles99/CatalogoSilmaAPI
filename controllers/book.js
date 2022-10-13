const Book = require('../models/book');

//get all available books
const getBooks = async(req, res) => {
    let books;
    try{
        books = await Book.find({});
    } catch (err) {
        console.log('DB error' + err);
        return res.status(505).send({error: 'Internal server error'});
    }
    if(books.length == 0){
        return res.status(404).send({error: 'No books found!'});
    }
    
    return res.json({data: books});
}

const createBook = async(req, res) => {
    
    let book = new Book(req.body);

    let bookExists;
    /** IF WE WANT TO AVOID DUPLICATES
    try {
        bookExists = await Book.f
    } catch (err) {
        
    }*/
    
    try {
        await book.save();
    } catch (err) {
        console.log('Error saving book ' + err);
        return res.sendStatus(505);
    }
    return res.json({success: 'Book created', book});
}

//const updateBook


//const deleteBook

module.exports = {
    getBooks: getBooks,
    createBook: createBook
}