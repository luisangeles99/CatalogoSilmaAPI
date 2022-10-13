const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;