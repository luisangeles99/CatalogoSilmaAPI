const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
//check morgan

const router = require('./routes/routes.js');
const app = express();
const port = process.env.PORT || require('./config.js').PORT

app.use(cors());
app.use(express.json());

app.use(router);

const connectionURL = process.env.CONNECTIONURL || require('./config.js').CONNECTIONURL;

console.log('Waiting for DB connection');
mongoose.connect(connectionURL).then(() => {
    console.log('DB connected');
    app.listen(port, function() {
        console.log('Listening in port: ' + port);
    });
}).catch(err => {
    console.log({error: err,
        message: 'DB connection failed'
    });
});



