
//we are creating basic authentication schema here 
const mongoose = require('mongoose');
const { Schema } = mongoose;


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

// export default mongoose.model('User', UserSchema);//It is a function it will return an object which refers to this model using which we can create documents.
module.exports = mongoose.model('User', UserSchema);