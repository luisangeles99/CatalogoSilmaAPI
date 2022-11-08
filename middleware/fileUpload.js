const multer = require('multer');

const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

//TODO: Improve middleware to accept certain files and sizes

module.exports = upload;