import express from 'express';
import Notes from '../models/Notes.js';
import fetchuser from '../middleware/fetchuser.js';
const router = express.Router();
//ROUTE 1 :fetch all notes of logged in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const userid = req.userid;
    const notes = await Notes.find({ userid });//The find() function is used to retrieve documents from a collection that match a specified query
    //Model.find(query) where query specifies the criteria for selecting documents//Its uses a JSON like syntax
    res.json(notes);
}
)
export default router;
