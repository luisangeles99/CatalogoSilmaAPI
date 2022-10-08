const express = require('express');
const router = express.Router();


//general
router.get('*', (req, res) => {
    res.send({
        error: 'The page you are looking for does not exist.'
    });
});

module.exports = router;