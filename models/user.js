const mongoose = require('mongoose');
const validation = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validation.isEmail(value)){
                throw new Error('Invalid email');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 12,
        trim: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;