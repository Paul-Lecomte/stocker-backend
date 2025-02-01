const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//we define the user model
const userSchema = mongoose.Schema({
    last_name : {
        type: String,
        trim: true
    },
    first_name : {
        type: String,
        trim: true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true
    }
}, {timestamps:true})

//compare the password with the one in the DB
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//encrypt the password
userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('User', userSchema)