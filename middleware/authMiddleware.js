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

const admin = asyncHandler(async(req, res, next) => {
    let token
    if (token){
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        let role = req.user = await User.findById(decoded.userId).select('role')
        if (role === "admin"){
            next()
        } else {
            res.status(401)
            throw new Error("Vous n'avez pas les droits nécessaire")
        }
    } else {
        res.status(401)
        throw new Error('aller hope sa dégage ta pas de token.')
    }
})

const superadmin = asyncHandler(async(req, res, next) => {
    let token
    if (token){
        const decoded = jwt.decode(token, process.env.JWT_SECRET)
        let role = req.user = await User.findById(decoded.userId).select('role')
        if (role === "superadmin"){
            next()
        } else {
            res.status(401)
            throw new Error("Vous n'avez pas les droits nécessaire")
        }
    } else {
        res.status(401)
        throw new Error('aller hope sa dégage ta pas de token.')
    }
})

module.exports = {
    protect,
    admin,
    superadmin
}