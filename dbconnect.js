const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017";
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to mongodb successfully");
    })
};
module.exports = connectToMongo;
//Exporting the function using module.exports