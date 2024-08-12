
//we are creating basic authentication schema here 
import mongoose, { Schema } from 'mongoose';


const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },//It is like a foreign key of mongoDB

    /*type: mongoose.Schema.Types.ObjectId: This specifies that the user field will store an ObjectId, which is a type used by MongoDB to uniquely identify documents.
    ref: 'User': This tells Mongoose that the user field is a reference to a document in the User collection. This creates a relationship between the Notes schema and the User schema, allowing you to populate or query the related user data.
    So, in essence, user acts as a foreign key, linking each note to a specific user. This setup is useful for scenarios where you need to associate notes with users and retrieve user information related to each note.*/
    //HOW THIS LINKING HAPPENS? 
    /*
    ************************************* 
    In your NotesSchema, the user field is defined with a type of ObjectId and a reference to the User model. This setup tells Mongoose that the user field should contain an ObjectId that corresponds to a document in the User collection
    ***************************************
    */
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notes', NotesSchema);
