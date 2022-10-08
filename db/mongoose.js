const mongoose = require('mongoose')

const connectionURL = process.env.CONNECTIONURL || require('../config.js').CONNECTIONURL;

const connection = mongoose.connect( connectionURL, {}, () => {console.log('Connected to db');});