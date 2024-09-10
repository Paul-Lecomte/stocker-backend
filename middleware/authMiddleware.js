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
            req.user = await User.findById(decoded.userId).select('-password')
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

module.exports = {
    protect
}