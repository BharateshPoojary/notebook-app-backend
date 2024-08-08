import mongoose from 'mongoose';
const mongoURI = "mongodb://localhost:27017/inote";
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to mongodb successfully");
    } catch (error) {
        console.log("Error connecting to mongoDB", error);

    }
};
export default connectToMongo;
//Exporting the function using module.exports