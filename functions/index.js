const connectToMongo = require('../dbconnect.js');
const auth = require('../routes/auth.js');
const notes = require('../routes/notes.js');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

(async () => {
    try {
        await connectToMongo();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
})();//connecting to mongodb

const app = express();//creating instance of express
app.use(cors());
app.use(express.json());//express.json() is a built in middleware function in Express for working with request body
app.use('/api/auth', auth);//app.use is used to define a middleware function and here I am redirecting the request to a seperate file
app.use('/api/notes', notes);

app.get('/', (req, res) => {
    try {
        res.json({ message: "Hello from Bharat" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
app.get('/page', (req, res) => {
    res.json({ message: 'Hi I am page' });
})

module.exports.handler = serverless(app);//This is for netlify serverless function
