
//we are creating basic authentication schema here 
import mongoose from 'mongoose';

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export default mongoose.model('Notes', NotesSchema);
