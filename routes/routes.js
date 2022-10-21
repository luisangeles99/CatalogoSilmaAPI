const express = require('express');
const router = express.Router();

const fileUpload = require('../middleware/fileUpload');
const books = require('../controllers/book');
const categories = require('../controllers/category.js');

//book routes
router.get('/getBooks', books.getBooks);
router.get('/getBook/:id', books.getBookById);
router.post('/createBook', 
            fileUpload.single('image'),
            books.createBook);
router.put('/updateBook/:id', books.updateBook);
router.delete('/deleteBook/:id', books.deleteBook);

//Category routes
router.get('/getCategories', categories.getCategories);
router.post('/createCategory', categories.createCategory);

//general
router.get('*', (req, res) => {
    res.send({
        error: 'The page you are looking for does not exist.'
    });
});

module.exports = router;