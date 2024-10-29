const express = require('express')
const userController = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const {superadmin} = require('../middleware/authMiddleware')
const router = express.Router()

//@route    Route User (POST)
//@desc     route pour créer un user
//@acess    Public
router.route('/register').post(superadmin, userController.register)

//@route    Route User (POST)
//@desc     route pour log un user
//@acess    Public
router.route('/login').post(userController.login)

//@route    Route User (POST)
//@desc     route pour logout un user
//@acess    Public
router.route('/logout').post(userController.logout)

//@route    Route User (PUT)
//@desc     route pour update le profile
//@acess    Private
router.route('/update').put(superadmin, userController.updateUserProfile)

//@route    Route User (GET)
//@desc     route pour récuperer un user
//@acess    Private
router.route('/get-profile/:_id').get(protect, userController.getUserProfile)

//@route    Route User (DELETE)
//@desc     route pour delete un user
//@acess    Private
router.route('/delete/:_id').get(superadmin, userController.getUserProfile)


module.exports = router