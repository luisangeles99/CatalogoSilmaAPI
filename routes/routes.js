const express = require('express');
const router = express.Router();

const books = require('../controllers/book');

//book routes
router.get('/getBooks', books.getBooks);
router.post('/createBook', books.createBook);

//general
router.get('*', (req, res) => {
    res.send({
        error: 'The page you are looking for does not exist.'
    });
});

module.exports = router;