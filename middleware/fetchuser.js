import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY = "inotebook@bharat#123";
//This is a custom userdefined middleware function which verifies the token and decodes it to access userid and it is passed to next middleware function 
const fetchuser = (req, res, next) => {
    const auth_token = req.header('auth-token');//this is a token which we have to pass in header of request
    if (!auth_token) {
        return res.status(401).send("Please authenticate using a valid token");
    }//Using return inside an if function will terminate the exceution of code and returns the response (in our case ) or any thing based on scenario
    try {

        const verify_user_with_auth_token = jwt.verify(auth_token, JWT_SECRET_KEY);//verify() function decodes the token and returns the payload data
        console.log(verify_user_with_auth_token);//{ user_id: '66b5f1c1a86b7376003f5778', iat: 1723292768 }<--This is payload data
        req.userid = verify_user_with_auth_token.user_id;//66b5f1c1a86b7376003f5778 accessing userid and passing to request object with key userid
        console.log(req.userid);
        next();//next is the next middleware function which will be called in our case it is residing in auth.js getuser endpoint 
    } catch (error) {
        res.status(401).send("Please authenticate using a valid token");
    }
}
export default fetchuser;