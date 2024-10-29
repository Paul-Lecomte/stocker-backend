//on importe les libreairies
const jwt = require('jsonwebtoken')

const generateToken= (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', //utilisé un cookie https en mode prod
        sameSite: 'strict', //prévenir les attaques CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, //cela fais 30 jours
    })
    console.log("token", token)
}


module.exports = {
    generateToken
}