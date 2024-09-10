//import des librairies
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const {generateToken} = require("../utils/generateToken");

//@desc     login utilisateur avec token
//@route    POST /api/user/auth
//@access   public
const login = asyncHandler(async(req, res) =>{
    const {email, password} = req.body

    const user = await User.findOne({email})
    if (user && await user.matchPassword(password)){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email
        })
    } else {
        res.status(401)
        throw new Error("L'adresse email ou le mot de passe sont incorrect.")
    }
})

//@desc     créer un user dans la BDD
//@route    POST /api/user
//@access   public
const register = asyncHandler(async(req, res) =>{
    const{last_name, first_name, email, password} = req.body
    if (!email || email === "" || !password || password === ""){
        res.status(400)
        throw new Error("Merci de bien remplir les champs obligatoires.")
    }

    //on va check si le user existe déjà dans la BDD
    const userExists = await User.findOne({email})
    if (userExists){
        res.status(400)
        throw new Error("Cette utilisateur existe déjà.")
    }

    //on enregistre l'utilisateur dans la BDD
    const user = await User.create({
        last_name,
        first_name,
        email,
        password
    })
    if (user){
        res.status(201).json({
            _id: user._id,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error("Une erreur est survenue merci de recommencé.")
    }
})

//@desc     Mettre a jour le profil d'un user
//@route    GET /api/user/profiles
//@access   Private
const updateUserProfile = asyncHandler(async(req, res)=>{
    const user = await User.findById(req.body._id)
    if (!user){
        res.status(400)
        throw new Error("l'utilisateur n'existe pas.")
    }

    user.last_name = req.body.last_name || user.last_name
    user.first_name = req.body.first_name || user.first_name
    user.email = req.body.email || user.email

    if(req.body.password){
        user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.status(201).json({
        _id: updatedUser._id,
        last_name: updatedUser.last_name,
        first_name: updatedUser.first_name,
        email: updatedUser.email
    })
})

//@desc     Logout utilidsteur
//@route    POST /api/user/logout
//@access   Private
const logout = asyncHandler(async(req, res)=>{
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({message: 'utilisateur déconnecter avec succes.'})
})

//@desc     Récuperer le profil d'un user avec son ID
//@route    GET /api/user/profiles
//@access   Private
const getUserProfile = asyncHandler(async(req, res) =>{
    const user = await User.findById(req.params._id)

    if (user){
        res.status(201).json({
            _id: user._id,
            last_name: user.last_name,
            first_name: user.first_name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error("Utilisateur non trouvé.")
    }
})

module.exports = {
    login,
    logout,
    register,
    getUserProfile,
    updateUserProfile
}