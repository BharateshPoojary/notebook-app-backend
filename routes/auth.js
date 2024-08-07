import express from 'express';
import User from '../models/User.js';
const router = express.Router();
router.post('/', (req, res) => {
    const user = User(req.body);
    user.save();
    console.log(req.body);
    res.send("saved successfully");


}
)
export default router;
