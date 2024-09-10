//import de mongoose (librairie mongodb)
const mongoose = require('mongoose')

//on esssaie de se connecter a mongodb. on envoie une erreur si CA échoue
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err){
        console.log(err)
    }
}

module.exports = connectDB