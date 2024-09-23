//import des librairies
const asyncHandler = require('express-async-handler')
const Furniture = require('../models/furnitureModel');


//@desc     Creation des furnitures
//@route    POST /api/furniture/create
//@access   private
const create = asyncHandler(async(req, res)   => {
    const{name, quantity, price,  description, location} = req.body
    if(!name || !quantity || !price || !description || !location){
        res.status(400)
        throw new Error('Missing required field')
    }

    //check if the object already exist in the DBB
    const furnitureExists = await User.findOne({name})
    if(furnitureExists){
        res.status(400)
        throw new Error('This furniture already exists')
    }

    //we save the furniturein the DBB
    const furniture = await Furniture.create({
        name,
        quantity,
        price,
        description,
        location
    })
    if(furniture){
        res.status(201).json({
            _id: furniture._id,
            name: furniture.name,
            quantity: furniture.quantity,
            price: furniture.price,
            description: furniture.description,
            location: furniture.location
        })
    } else {
        res.status(400)
        throw new Error('Fatal error please try again')
    }
})


//@desc     aller checrcher les infos d'un objet
//@route    GET /api/furniture/:_id
//@access   private
const getFurniture = asyncHandler(async(req, res) => {
    const furniture = await Furniture.findById(req.params._id)

    if(furniture){
        res.status(200).json({
            _id: furniture._id,
            name: furniture.name,
            quantity: furniture.quantity,
            price: furniture.price,
            description: furniture.description,
            location: furniture.location
        })
    } else {
        res.status(400)
        throw new Error('Error furniture does not exist')
    }
})


//@desc     update les infos d'un objet
//@route    PUT /api/furniture/object
//@access   private
const updateFurniture = asyncHandler(async(req, res) => {
    const furniture = await Furniture.findById(req.params._id)
    if(!furniture){
        res.status(400)
        throw new Error('The user doesn\'t exist')
    }

    furniture.name = req.body.first_name || furniture.name
    furniture.quantity = req.body.quantity || furniture.quantity
    furniture.price = req.body.price || furniture.price
    furniture.description = req.body.description || furniture.description
    furniture.location = req.body.location || furniture.location

    const updateObject = await furniture.save()

    res.status(201).json({
        _id: furniture._id,
        name: furniture.name,
        quantity: furniture.quantity,
        price: furniture.price,
        description: furniture.description,
        location: furniture.location
    })
})


//@desc     Supprimer un objet
//@route    DELETE /api/furniture/:id
//@access   Private
const deleteFurniture = asyncHandler(async (req, res) => {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
        res.status(404);
        throw new Error('Objet non trouvé.');
    }

    await furniture.remove();
    res.status(200).json({ message: "Objet supprimé avec succès." });
});



module.exports = {
    create,
    getFurniture,
    updateFurniture,
    deleteFurniture
}