const express = require('express')
const userController = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const {admin} = require('../middleware/authMiddleware')
const router = express.Router()

//@route    Route User (POST)
//@desc     route pour créer un user
//@acess    Public
router.route('/register').post(admin, userController.register)

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
router.route('/profile').put(admin, userController.updateUserProfile)

//@route    Route User (GET)
//@desc     route pour récuperer un user
//@acess    Private
router.route('/profile/:_id').get(protect, userController.getUserProfile)


module.exports = router