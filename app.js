const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authenticationRoute = require('./routes/authenticationRoute');

dotenv.config();
const app = express();

//Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//route
app.use('/api',authenticationRoute);

app.use('/', (req, res, next) =>{
    return res.status(200).json({"message":'You got a valid response'})
})

app.use((error, req, res, next) =>{
    let statusCode = error.statusCode;
    let message = error.message;
    let data = error.data
    return res.status(statusCode).json({"message":message, "errors": data})
});

mongoose.connect(`mongodb+srv://projectx:${process.env.MONGODBPASSWORD}@cluster0.vp0vvvd.mongodb.net/projectx?retryWrites=true&w=majority`).then(results =>{
    app.listen(3001, () =>{
        console.log("Connection to DB successful...Server is listening on port 3001..")
    });
}).catch(err =>{
    console.log(err)
})





