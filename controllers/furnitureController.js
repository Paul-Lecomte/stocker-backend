//import des librairies
const asyncHandler = require('express-async-handler')
const Furniture = require('../models/furnitureModel');


//@desc     Creation des furnitures
//@route    POST /api/furniture/create
//@access   private
const create = asyncHandler(async(req, res)   => {
    const{name, quantity, price,  description, location, movement} = req.body
    if(!name || !quantity || !price || !description || !location){
        res.status(400)
        throw new Error('Missing required field')
    }

    //check if the object already exist in the DBB
    const furnitureExists = await Furniture.findOne({name})
    if(furnitureExists){
        res.status(400)
        throw new Error('This furniture already exists')
    }

    //we save the furniture in the DBB
    const furniture = await Furniture.create({
        name,
        quantity,
        price,
        description,
        location,
        movement
    })
    if(furniture){
        res.status(201).json({
            _id: furniture._id,
            name: furniture.name,
            quantity: furniture.quantity,
            price: furniture.price,
            description: furniture.description,
            location: furniture.location,
            movement: furniture.furniture_movement
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
            location: furniture.location,
            movement: furniture.movement
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
    furniture.movement = req.body.movement || furniture.movement

    const updateObject = await furniture.save()

    res.status(201).json({
        _id: furniture._id,
        name: furniture.name,
        quantity: furniture.quantity,
        price: furniture.price,
        description: furniture.description,
        location: furniture.location,
        movement: furniture.movement
    })
})

//@desc     increment object
//@route    PUT /api/furniture/:id
//@access   Private
const incrementFurniture = asyncHandler(async(req, res) =>{
    const {id} = req.body
    const furniture = await Furniture.findById(id)
    if (!furniture){
        res.status(400)
        throw new Error("This object doesn't exist.")
    }
    furniture.movement += 1;
    await furniture.save()
    res.status(200).json(`the object is now at : ${furniture.movement}`)
})

//@desc     decrement object
//@route    PUT /api/furniture/:id
//@access   Private
const decrementFurniture = asyncHandler(async(req, res) =>{
    const {id} = req.body
    const furniture = await Furniture.findById(id)
    if (!furniture){
        res.status(400)
        throw new Error("This object doesn't exist.")
    }
    furniture.movement -= 1;
    await furniture.save()
    res.status(200).json(`the object is now at : ${furniture.movement}`)
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
    deleteFurniture,
    incrementFurniture,
    decrementFurniture
}