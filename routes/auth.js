import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY = "inotebook@bharat#123";
const router = express.Router();
//ROUTE1:Endpoint for  creating  a new user i.e. SignUp endpoint
router.post('/createuser', [body('name', 'Name must be at least 3 characters').isLength({ min: 3 }), body('email', 'Enter a valid email').isEmail(), body('password', 'passwor must be at least 5 characters').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);//This will validate or check every request or data sent by client  if there is any error it will return in array 
    if (!errors.isEmpty()) {//here we are checking whether there is any error or not, if errors are not empty then sending response status code 400 and errors in array
        return res.status(400).json({ errors: errors.array() });
    }
    //METHOD 1:
    //We are creating object of user model (no requirement of new keyword automatically it will  create an instance ) and we are populating the data of request body 
    // try {
    //     const user = User(req.body);//Each time it will get one document from request body and it will match with the schema provided .User(req.body) returns an instance of the User model populated with the data from the request body.
    //     await user.save();//next it will save in database here why await is there because it will return a promise it ensures that the code waits for the promise to be resolved before moving on.user.save() is an asynchronous operation that interacts with the database. By using await, you ensure that the database operation completes before proceeding to the next line of code.
    //     console.log(req.body);
    //     res.json(user);
    // } catch (error) {
    //     if (error.code === 11000) {
    //         res.status(400).json({ message: 'Please enter a unique email.' });
    //     } else {
    //         res.status(500).json({ message: 'An error occurred.' });
    //     }
    // }
    //METHOD 2:
    //check whether user with this email already exists
    let emailcontains = await User.findOne({ email: req.body.email });
    if (emailcontains) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" });
    }
    //create method creates and saves the document
    const salt = await bcrypt.genSalt(10);//genSalt function will generate a salt 
    const secure_password = await bcrypt.hash(req.body.password, salt);//hash function will generate a hash for current password and it will append salt to that hashed password
    try {
        let creatingnewuser = await User.create({//here await is required as processing from db takes time
            name: req.body.name,
            password: secure_password,
            email: req.body.email
        });
        const data = { user_id: creatingnewuser.id };//here I am giving id as it uniquely defines each document
        const authtoken = jwt.sign(data, JWT_SECRET_KEY);//sign function is used to generate JWT token no one can tamper or can't make any changes as it includes secret key
        res.json({ authtoken });//ES6 syntax ,  only providing value i.e (variable name ) inside {} curly braces , In output key  will be the (variable name)i.e "authtoken" here and value will be JWTtoken 
        console.log(authtoken);

    } catch (error) {
        //If some diiferent error arise it will be handled here
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
})
//ROUTE2:Authenticating a user when tries to login it is signin/login endpoint
router.post('/login', [body('email', 'Enter a valid email').isEmail(), body('password', "Password cannot be blank").isLength({ min: 1 })], async (req, res) => {
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
    const verify_user = await User.findOne({ email: loginusercreds.email });
    if (!verify_user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
    }
    try {
        //compare function compare the password sent by user with the password present in database which is in hash
        const password_compare = await bcrypt.compare(loginusercreds.password, verify_user.password);
        if (!password_compare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const auth_token = jwt.sign({ user_id: verify_user.id }, JWT_SECRET_KEY);
        res.json({ auth_token });
        console.log(auth_token);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error occured" });
    }
})

export default router;
