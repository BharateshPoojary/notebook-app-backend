import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import fetchuser from '../middleware/fetchuser.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: "C:\\Users\\Admin\\OneDrive\\Desktop\\web development\\MERN APP\\notebook_app_backend\\.env.local" });
const jwt_key = process.env.JWT_SECRET_KEY;
let success = false;
const router = express.Router();

//ROUTE1:Endpoint for  creating  a new user i.e. SignUp endpoint
router.post('/createuser', [body('name', 'Name must be at least 3 characters').isLength({ min: 3 }), body('email', 'Enter a valid email').isEmail(), body('password', 'passwor must be at least 5 characters').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);//This will validate or check every request or data sent by client  if there is any error it will return in array 
    if (!errors.isEmpty()) {//here we are checking whether there is any error or not, if errors are not empty then sending response status code 400 and errors in array
        return res.status(400).json({ errors: errors.array() });
    }
    //check whether user with this email already exists
    let emailcontains = await User.findOne({ email: req.body.email });
    if (emailcontains) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" });
    }
    //create method creates and saves the document
    const salt = await bcrypt.genSalt(10);//genSalt function will generate a salt 
    const secure_password = await bcrypt.hash(req.body.password, salt);//hash function will generate a hash for current password and it will append salt to that hashed password
    /*The 10 in bcrypt.genSalt(10) refers to the salt rounds or cost factor. This number controls how many times the hashing algorithm is run on the data. A higher number means the algorithm runs more times, which increases the computation time and makes the hash stronger and more resistant to brute-force attacks*/
    try {
        let creatingnewuser = await User.create({//here await is required as processing from db takes time
            name: req.body.name,
            password: secure_password,
            email: req.body.email
        });
        const data = { user_id: creatingnewuser.id };//here I am giving id as it uniquely defines each document
        const authtoken = jwt.sign(data, jwt_key);//sign function is used to generate JWT token no one can tamper or can't make any changes as it includes secret key
        success = true;
        res.json({ success, authtoken });//ES6 syntax ,  only providing value i.e (variable name ) inside {} curly braces , In output key  will be the (variable name)i.e "authtoken" here and value will be JWTtoken 
        console.log(authtoken);

    } catch (error) {
        //If some diiferent error arise it will be handled here
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
})

//ROUTE2:Authenticating a user when tries to login it is signin/login endpoint
router.post('/login', [body('email', 'Enter a valid email').isEmail(), body('password', "Password cannot be blank").isLength({ min: 1 })], async (req, res) => {
    // console.log(jwt_key);
    const errors = validationResult(req);//This will validate or check every request or data sent by client  if there is any error it will return in array 
    if (!errors.isEmpty()) {//here we are checking whether there is any error or not, if errors are not empty then sending response status code 400 and errors in array
        return res.status(400).json({ errors: errors.array() });
    }
    //METHOD1
    const loginusercreds = {
        email: req.body.email,
        password: req.body.password,
    }
    //METHOD2:Destructuring
    // const { email, password } = req.body;
    const verify_user = await User.findOne({ email: loginusercreds.email });//findOne() method is used to find a single document in a MongoDB Collection. Model.findOne(query) here in syntax Query is an object specifying the conditions the document must match.
    //If no document matches it will return null or else it will return the first document that matches the query criteria if there are multiple matches
    if (!verify_user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    try {
        //compare function compare the password sent by user with the password present in database which is in hash
        const password_compare = await bcrypt.compare(loginusercreds.password, verify_user.password);
        if (!password_compare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const auth_token = jwt.sign({ user_id: verify_user.id }, jwt_key);//sign function for encoding the payload data and it returns the auth token
        success = true;
        res.json({ success, auth_token });
        // console.log(auth_token);
    } catch (error) {

        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
})

//ROUTE3:Accessing user credentials after login
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userid = req.userid;//accessing userid from request object 
        const usercreds = await User.findById(userid).select("-password");//accessing the user credentials of logged in user using its id and not considering the password thatswhy (-password)
        //Model.findById(id)This method is used to find a single document in a collection by using it unique id here (id) is a unique identifier of the document which we want to retrieve.It can be any unique string.
        //Model.select(fields) It is used  to specify which fields should be included or excluded in the result of a query.This method is particularly useful when you want to retrieve only certain fields from a document instead of fetching the entire document 
        res.send(usercreds);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
})

exports.handler = router;
//here I have used the middleware function the reason is that if I not used that everytime If I create different endpoint in future and if I need the user creds  I had to repeat the process of verifying the JWT token and accessing the userid so in order to overcome that I have created a seperate file called fetchuser.js// which includes a middleware function which will be invoked for getuser endpoint and this middleware function I can use for different endpoint as well in future to verify JWT Token and accessing id from it to get user credentials
