const express = require('express');
const furnitureController = require('../controllers/furnitureController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc     Create furniture
// @route    POST /api/furniture/create
// @access   private
router.route('/create').post(admin, furnitureController.create);

// @desc     Get furniture info
// @route    GET /api/furniture/:_id
// @access   private
router.route('/:_id').get(protect, furnitureController.getFurniture);

// @desc     Update furniture info
// @route    PUT /api/furniture/:_id
// @access   private
router.route('/update/:_id').put(admin, furnitureController.updateFurniture);

// @desc     Delete furniture
// @route    DELETE /api/furniture/:_id
// @access   private
router.route('/delete/:_id').delete(admin, furnitureController.deleteFurniture);

// @desc     Increment quantity
// @route    PUT /api/furniture/increment
// @access   private
router.route('/increment').put(admin, furnitureController.incrementFurniture);

// @desc     Decrement quantity
// @route    PUT /api/furniture/decrement
// @access   private
router.route('/decrement').put(admin, furnitureController.decrementFurniture);

// @desc     Get total count of furnitures
// @route    GET /api/furniture/count
// @access   private
router.route('/count').get(protect, furnitureController.getFurnitureCount);

// @desc     Get today's movements
// @route    GET /api/furniture/today-movements
// @access   private
router.route('/today-movements').get(protect, furnitureController.getTodayMovements);

// @desc     Get most sold furniture
// @route    GET /api/furniture/most-sold
// @access   private
router.route('/most-sold').get(protect, furnitureController.getMostSoldFurniture);

// @desc     Get highest priced furniture
// @route    GET /api/furniture/highest-price
// @access   private
router.route('/highest-price').get(protect, furnitureController.getHighestPriceFurniture);

module.exports = router;
