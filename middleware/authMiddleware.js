//import des librairies
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) =>{
    let token
    token = req.cookies.jwt
    if (token){
        try {
            const decoded = jwt.decode(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select('password')
            next()
        } catch (e){
            console.log(e)
            res.status(401)
            throw new Error('erreur de token.')
        }
    } else {
        res.status(401)
        throw new Error('aller hope sa dégage ta pas de token.')
    }
})

const admin = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            // Use jwt.verify to validate the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('role');

            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user has the superadmin role
            if (user.role === "superadmin" || user.role === "admin") {
                req.user = user;  // Pass the user data to the next middleware
                next();
            } else {
                return res.status(401).json({ message: `Access denied, your role is: ${user.role}` });
            }
        } catch (e) {
            console.error(e); // Log the error
            return res.status(401).json({ message: 'Invalid token or token error.' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided, access denied.' });
    }
})

const superadmin = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;
    if (token) {
        try {
            // Use jwt.verify to validate the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('role');

            // Check if user exists
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if user has the superadmin role
            if (user.role === "superadmin") {
                req.user = user;  // Pass the user data to the next middleware
                next();
            } else {
                return res.status(401).json({ message: `Access denied, your role is: ${user.role}` });
            }
        } catch (e) {
            console.error(e); // Log the error
            return res.status(401).json({ message: 'Invalid token or token error.' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided, access denied.' });
    }
})

module.exports = {
    protect,
    admin,
    superadmin
}