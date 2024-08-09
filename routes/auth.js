import express from 'express';
import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
const router = express.Router();
router.post('/createuser', [body('name', 'Name must be at least 3 characters').isLength({ min: 3 }), body('email', 'Enter a valid email').isEmail(), body('password', 'passwor must be at least 5 characters').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);//This will validate or check every request or data sent by client  if there is any error it will return in array 
    if (!errors.isEmpty()) {//here we are checking whether there is any error or not if errors are not empty then sending response status code 400 and errors in array
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
    try {
        let creatingnewuser = await User.create({//here await is required as processing from db takes time
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        })
        res.json(creatingnewuser);
        console.log(creatingnewuser);

    } catch (error) {
        //If some diiferent error arise it will be handled here
        console.log(error.message);
        res.status(500).json({ error: "some error occured" });
    }
})
export default router;
