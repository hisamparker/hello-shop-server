import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const verifyUser = async(req, res, next) => {
    try {
        // grab the token from the cookie (that was parsed for us by cookie-parser :)
        const token = req.cookies.token;
        if(!token) {
            return res.send(false)
        //    return res.status(401).json({ errorMessage: 'Not authorized' });
        }
        const verifiedRequest = jwt.verify(token, process.env.JWT_SECRET)
        // I find the user using the id taken from the object returned from jwt.verify, 
        // add user property to the request and 
        // make the value of req.user the user i found in the db - their password info (when i created the token, I used the id to verify, so the id is there with the token)
        // now the request object will have a request. user on it :D
        req.user = await User.findById(verifiedRequest.id).select('-password')
        next()
    } catch (err) {
        console.error(err);
        res.json(false)
        // res.status(401).json({ errorMessage: 'Not authorized' });
    }
}

export default verifyUser