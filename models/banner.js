const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    publicImgId: { //this ID is used for deleting pass banners
        type: String
    }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;