const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\MERN APP\\notebook_app_backend\\.env.local" });
// const jwt_key = process.env.JWT_SECRET_KEY;
const mongoURI = process.env.MONGO_URI;
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to mongodb successfully");
    } catch (error) {
        console.log("Error connecting to mongoDB", error);

    }
};
module.exports = connectToMongo;
//Exporting the function using module.exports