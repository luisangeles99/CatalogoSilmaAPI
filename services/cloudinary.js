const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || require('../config.js').CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY || require('../config.js').CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET || require('../config.js').CLOUDINARY_SECRET
});

upload = (path, folder) => {
    return cloudinary.v2.uploader.upload(path, {
        folder
    }).then((data) => {
        return { url: data.url, public_id: data.public_id };
    }).catch((error) => {
        console.log(error);
    });
}

remove = async (public_id) => {
    await cloudinary.v2.uploader.destroy(public_id, function(err, res) {
        console.log(err, res);
    });
}

module.exports = {
    upload, remove
}