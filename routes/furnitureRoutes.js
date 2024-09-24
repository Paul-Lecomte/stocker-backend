const express = require('express')
const furnitureController = require('../controllers/furnitureController')
const {protect} = require('../middleware/authMiddleware')
const {admin} = require('../middleware/authMiddleware')
const router = express.Router()

//@desc     Creation des furnitures
//@route    POST /api/furniture/create
//@access   private
router.route('/create').post(admin, furnitureController.create)


//@desc     aller checrcher les infos d'un objet
//@route    GET /api/furniture/:_id
//@access   private
router.route('/furniture/:_id').get(protect, furnitureController.getFurniture)


//@desc     update les infos d'un objet
//@route    PUT /api/furniture/object
//@access   private
router.route('/update').put(admin, furnitureController.updateFurniture)


//@desc     delete un objet
//@route    DELETE /api/furniture/supress
//@access   private
router.route('/delete/:id').put(admin, furnitureController.deleteFurniture)

module.exports = router