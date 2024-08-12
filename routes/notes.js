import express from 'express';
import { body, validationResult } from 'express-validator';
import Note from '../models/Note.js';
import fetchuser from '../middleware/fetchuser.js';
const router = express.Router();

//ROUTE 1 :fetch all notes of logged in user
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const user = req.userid;
        const notes = await Note.find({ user });//The find() function is used to retrieve documents from a collection that match a specified query (query means field name of document)
        //Model.find(query) where query specifies the criteria for selecting documents//Its uses a JSON like syntax
        res.json(notes);
    } catch (error) {
        //If some diiferent error arise it will be handled here
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
}
)

//ROUTE 2 :Add notes of logged in user
router.post('/addnotes', fetchuser, [body('title', 'title must be atleast 3 characters').isLength({ min: 3 }), body('description', 'description must be atleast 5 characters').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);//This will validate or check every request or data sent by client  if there is any error it will return in array 
    if (!errors.isEmpty()) {//here we are checking whether there is any error or not, if errors are not empty then sending response status code 400 and errors in array
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description } = req.body;
        const notes = new Note({ title, description, user: req.userid });
        const savednote = await notes.save();
        res.json(savednote);
    } catch (error) {
        //If some different error arise it will be handled here
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
}
)

//ROUTE 3 :Update an existing notes of logged in user
router.put('/updatenotes/:id', fetchuser, async (req, res) => {
    const newNote = {};
    const { title, description } = req.body;
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    const noteId = req.params.id;

    const note = await Note.findById(noteId);
    if (!note) {
        return res.status(404).send("Not found");
    }
    if (note.user.toString() !== req.userid) {//note.user.toString() this is the id of the user we are accessing and converting it to string 
        return res.status(401).send("Not allowed");
    }
    try {
        const Updatednote = await Note.findByIdAndUpdate(noteId, { $set: newNote }, { new: true });
        //findByIdAndUpdate: This is a Mongoose method that finds a document by its ID and updates it with the specified changes.
        //{ $set: newNote } The $set operator is used to update the specified fields in the document. In this case, newNote is an object containing the fields and their new values.
        //{ new: true } option tells Mongoose to return the updated document instead of the original document before the update
        res.json(Updatednote);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
});
export default router;
