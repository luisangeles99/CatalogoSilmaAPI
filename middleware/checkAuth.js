const jwt = require('jsonwebtoken');
const secret = process.env.BCRYPT_SECRET || require('../config').BCRYPT_SECRET;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Auth: 'Bearer TOKEN'
        if(!token) {
            return res.status(401).send({error: 'Authentication required'});
        }
        const decodedToken = jwt.verify(token, 'SILMAprojectAPIcAtInt20');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        return res.status(401).send({error: 'Authentication failed'});
    }
}