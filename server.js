const express = require('express')
const server = express()
const bodyparser = require('body-parser')
require('dotenv').config()
const { port } = require('./config/config.js')
const mongoose = require('mongoose')
const db = process.env.mongourl
const productroute = require('./routes/products.js')
const userroute = require('./routes/user.js')



server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(bodyparser.json())
server.use('/', productroute)  
server.use('/', userroute)  


mongoose.connect(db)
    .then(() => {
        console.log('Connected to database  :)');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB :(', err.message);
    });

    server.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });




server.listen(port, () => { console.log(`server running on : ${port}`); })