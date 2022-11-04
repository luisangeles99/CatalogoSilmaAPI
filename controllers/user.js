const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const createUser = async(req, res) => {
    const user = new User(req.body);
    let existingUser;

    try {
        existingUser = await User.findOne({email: user.emai});
    } catch (err) {
        return res.status(505).send({error: 'Internal server error'});
    }

    if(existingUser){
        return res.status(422).send({error: 'User already exists'});
    }

    user.password = bcrypt.hashSync(user.password, 12);

    try {
        await user.save();
    } catch (err) {
        return res.status(505).send({error: 'Internal server error'});
    }

    res.json({
        emailAdmin: user.email,
        status: "User created successfully"
    });
}

const getUser = async(req, res) => {
    const email = req.body.email;
    let user;

    try {
        user = await User.findOne({email: email}, '-password');
        if(!user){
            return res.status(404).send({error: 'User not found.'});
        }

    } catch (err) {
        return res.status(505).send({error: 'Internal server error'});
    }

    res.json({
        user
    });
}

const loginUser = async(req, res) => {
    const {email, password} = req.body;
    let userExists;
    
    try {
        userExists = await User.findOne({email: email});
    } catch (err) {
        return res.status(505).send({error: 'Internal server error'});
    }

    if(!userExists){
        return res.status(403).send({error: 'Incorrect email or password'});
    }

    let validPassword;

    try {
        validPassword = await bcrypt.compare(password, userExists.password);
    } catch (err) {
        return res.status(403).send({error: 'Incorrect email or password'});
    }

    if(!validPassword){
        return res.status(403).send({error: 'Incorrect email or password'});
    }

    let token;
    let secret = process.env.BCRYPT_SECRET || require('../config').BCRYPT_SECRET;
    try {
        token = jwt.sign(
           {userId: userExists.id, email: userExists.email},
           secret,
            {expiresIn: '2h'}
        );
    } catch (err) {
        return res.status(505).send({error: 'Internal server error, login failed'});
    }

    res.json({
        userId: userExists.id,
        email: userExists.email,
        token: token
    });
}

module.exports = {
    createUser: createUser,
    getUser: getUser,
    loginUser: loginUser
}