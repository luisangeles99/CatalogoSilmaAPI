const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String, 
        required: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    purchaseURL: {
        type: String
    },
    synopsis: {
        type: String
    },
    categoryId: {
        type: mongoose.Types.ObjectId, 
        //required: true,
        ref: 'Category'
    }
    //TODO: Include the book cover img and book preview
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;