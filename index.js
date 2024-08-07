import connectToMongo from './dbconnect.js';
import express from 'express';
import auth from './routes/auth.js';
import notes from './routes/notes.js';

(async () => {
    await connectToMongo();
})();
const app = express();
const port = "3000";
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/notes', notes);

app.get('/', (req, res) => {
    res.send("Hello from Bharat");
});
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})