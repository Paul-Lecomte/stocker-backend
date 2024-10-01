//on importe les librairies
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//on définie le schéma de donné pour les user
const userSchema = mongoose.Schema({
    last_name : {
        type: String,
        trim: true // on supprime les espaces est les caractères inutiles
    },
    first_name : {
        type: String,
        trim: true
    },
    email : {
        type : String,
        unique : true, //ne peut exister qu'une seule fois dans la bdd
        required : true
    },
    password : {
        type : String,
        req : true
    },
    role : {
        type : String,
        req : true
    }
}, {timestamps:true})

//compare le mot de passe entrer par le user avec celui de la bdd
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//on va encrypter le mot de passe ici
userSchema.pre('save', async function(next){
    //si le mot de passe na pas été changé on va passer le hash du mot de passe
    if (!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)