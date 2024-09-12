const express = require('express')
const furnitureController = require('../controllers/furnitureController')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

//@desc     Creation des furnitures
//@route    POST /api/furniture/create
//@access   private
router.route('/create').post(protect, furnitureController.create)


//@desc     aller checrcher les infos d'un objet
//@route    GET /api/furniture/:_id
//@access   private
router.route('/furniture/:_id').get(protect, furnitureController.getFurniture)


//@desc     update les infos d'un objet
//@route    PUT /api/furniture/object
//@access   private
router.route('/object').put(protect, furnitureController.updateFurniture)


//@desc     delete un objet
//@route    DELETE /api/furniture/supress
//@access   private
router.route('/supress').put(protect, furnitureController.deleteFurniture)

module.exports = router