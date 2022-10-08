const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//check morgan

const router = require('./routes/routes.js');
const app = express();
const port = process.env.PORT || require('./config.js').PORT

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT');
  
    next();
  });

app.use(router);

const connectionURL = process.env.CONNECTIONURL || require('./config.js').CONNECTIONURL;

console.log('Waiting for DB connection');
mongoose.connect(connectionURL).then(() => {
    console.log('DB connected');
    app.listen(port, function() {
        console.log('Listening in port : ' + port);
    });
}).catch(err => {
    console.log({error: err,
        message: 'DB connection failed'
    });
});



