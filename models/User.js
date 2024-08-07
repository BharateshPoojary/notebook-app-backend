
//we are creating basic authentication schema here 
import mongoose from 'mongoose';

const UserSchema = new Schema({//It is an instance of a class i.e. a constructor function 
    //field name is [name , email etc] here
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', UserSchema);//It is a function 
