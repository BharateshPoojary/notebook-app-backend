import connectToMongo from './dbconnect.js';
import express from 'express';
import auth from './routes/auth.js';
import notes from './routes/notes.js';
import cors from 'cors';
import serverless from 'serverless-http';
(async () => {
    await connectToMongo();
})();//connecting to mongodb

const app = express();//creating instance of express
// const port = "5000";
app.use(cors());
app.use(express.json());//express.json()is a built in middleware function in Express for working with request body
app.use('/api/auth', auth);//app.use is used to define a middleware function and here I am redirecting the request to a seperate file
app.use('/api/notes', notes);

app.get('/', (req, res) => {
    res.send("Hello from Bharat");
});

// Export the serverless function handler
module.exports.handler = serverless(app);