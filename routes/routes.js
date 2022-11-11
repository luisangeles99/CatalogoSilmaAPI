const express = require('express');
const router = express.Router();

const fileUpload = require('../middleware/fileUpload');
const books = require('../controllers/book');
const categories = require('../controllers/category.js');
const user = require('../controllers/user');
const checkAuth = require('../middleware/checkAuth');
const banner = require('../controllers/banner');

/****************************  NO AUTHORIZATION REQUIRED   ********************************/
//book routes
router.get('/getBooks', books.getBooks);
router.get('/getBook/:id', books.getBookById);

//Category routes
router.get('/getCategories', categories.getCategories);
router.get('/getCategory/:id', categories.getCategoryById);
router.put('/updateCategory/:id', categories.updateCategory);
router.delete('/deleteCategory/:id', categories.deleteCategory);

//User routes
router.post('/userLogin', user.loginUser);

//Banner routes
router.get('/getBanner', banner.getBanner);

/******************************* AUTHORIZATION REQUIRED   ********************************/
router.use(checkAuth); //MIDDLEWARE FOR VALIDATION
//book routes
router.post('/createBook',
            fileUpload.fields([
                {name: 'image'},
                {name: 'pdf'}
            ]),
            books.createBook);
router.put('/updateBook/:id', books.updateBook);
router.delete('/deleteBook/:id', books.deleteBook);

//Category routes
router.post('/createCategory', categories.createCategory);

//User routes
router.post('/createUser', user.createUser);

//Banner routes
router.post('/createBanner', 
        fileUpload.single('image'),
        banner.createBanner);
router.put('/updateBanner',
        fileUpload.single('image'),
        banner.updateBanner);

//general
router.get('*', (req, res) => {
    res.send({
        error: 'The page you are looking for does not exist.'
    });
});

module.exports = router;