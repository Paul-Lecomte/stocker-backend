const express = require('express')
const userController = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

//@route    Route User (POST)
//@desc     route pour créer un user
//@acess    Public
router.route('/register').post(userController.register)

//@route    Route User (POST)
//@desc     route pour log un user
//@acess    Public
router.route('/auth').post(userController.login)

//@route    Route User (POST)
//@desc     route pour logout un user
//@acess    Public
router.route('/logout').post(userController.logout)

//@route    Route User (PUT)
//@desc     route pour update le profile
//@acess    Private
router.route('/profile').put(protect, userController.updateUserProfile)

//@route    Route User (GET)
//@desc     route pour récuperer d'un user
//@acess    Private
router.route('/profile/:_id').get(userController.getUserProfile)


module.exports = router