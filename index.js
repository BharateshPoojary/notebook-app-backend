import connectToMongo from './dbconnect.js';
import express from 'express';
(async () => {
    await connectToMongo();
})();
const app = express();
const port = "3000";
app.get('/', (req, res) => {
    res.send("Hello from Bharat");
});
app.listen(port, () => {
    console.log(`http://localhost:${port}`);

})