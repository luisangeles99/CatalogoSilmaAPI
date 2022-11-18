const Book = require('../models/book');
const { upload, uploadPDF } = require('../services/cloudinary'); 

//get all available books
const getBooks = async(req, res) => {
    let books;
    try{
        const pipeline = [
            {
              '$match': {}
            }, {
              '$lookup': {
                'let': {
                  'catId': '$categoryId'
                }, 
                'from': 'categories', 
                'pipeline': [
                  {
                    '$match': {
                      '$expr': {
                        '$eq': [
                          '$_id', '$$catId'
                        ]
                      }
                    }
                  }
                ], 
                'as': 'catName'
              }
            }, {
              '$set': {
                'catName': {
                  '$arrayElemAt': [
                    '$catName.name', 0
                  ]
                }
              }
            }
          ]

        books = await Book.aggregate(pipeline);
    } catch (err) {
        console.log('DB error' + err);
        return res.status(505).send({error: 'Internal server error'});
    }
    if(books.length == 0){
        return res.status(404).send({error: 'No books found!'});
    }
    
    return res.json({data: books});
}

//get book with id
const getBookById = async(req, res) => {
    let book;
    //sanitize id
    const bookId = req.params.id;
    try {
        book = await Book.findById(bookId)
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }

    if(!book){
        return res.status(400).send({
            error: 'Book not found!'
        });
    }

    return res.json({
        data: book
    });
}

//create book
const createBook = async(req, res) => {
    let book = new Book(req.body);

    let bookExists;
    
    try {
        //save img
        if(req.files.image){
            imgPath = req.files.image[0].path;
            
            const res = await upload(imgPath, 'book-cover-imgs');
            book.coverImg = res.url;
        }
        
        //save pdf
        if(req.files.pdf){
            pdfPath = req.files.pdf[0].path;
            const resPdf = await uploadPDF(pdfPath, 'book-pdf-preview');
            book.bookPreview = resPdf.url;
        }


        await book.save();

    } catch (err) {
        console.log('Error saving book ' + err);
        return res.sendStatus(400);
    }
    return res.json({success: 'Book created', book});
}

//update book, check available fields
const updateBook = async(req, res) => {
    //requires the id as a paremeter
    //TODO: Sanitize id
    const bookId = req.params.id;
    const updates = Object.keys(req.body);

    //TODO: validUpdates
    const allowedUpdates = ['name', 'author', 'coverImg', 'synopsis', 'purchaseURL', 'publishDate', 'image', 'pdf', 'categoryId'];

    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid update check avaliable update keys ' + allowedUpdates});
    }

    try {
        if(req.files){
            //save image
            if(req.files.image){
                imgPath = req.files.image[0].path;
                
                const res = await upload(imgPath, 'book-cover-imgs');
                req.body.coverImg = res.url;
            }
             
            //save pdf
            if(req.files.pdf){
                pdfPath = req.files.pdf[0].path;
                const resPdf = await uploadPDF(pdfPath, 'book-pdf-preview');
                req.body.bookPreview = resPdf.url;
            }
        }
        
    } catch (err) {
        console.log('Error saving book ' + err);
        return res.sendStatus(400);
    }

    Book.findOneAndUpdate({_id: bookId}, req.body).then((book) => {
        if(!book){
            return res.status(404).send({ error: `Invalid id. ${bookId} not found.`});
        };
        
        return res.status(200).send(
            {success: 'Updated book.'}
            );
    }).catch(function(err){
        console.log(err);
        return res.sendStatus(500);
    });
}

//deleteBook using id
const deleteBook = async(req, res) => {
    const bookId = req.params.id;
    let book;

    try{
        book = await Book.findOneAndDelete({_id: bookId});
    } catch(err){
        return res.sendStatus(505);
    }

    if(!book){
        return res.status(404).send({ error: `Invalid id. ${bookId} not found.`});
    }

    return res.status(200).send({
        success: 'Book deleted'
    });
}

module.exports = {
    getBooks: getBooks,
    getBookById: getBookById,
    createBook: createBook,
    updateBook: updateBook,
    deleteBook: deleteBook
}