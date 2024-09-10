const express = require('express')
const {errorHandler} = require("./middleware/errorHandler");
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const cookieParser = require("cookie-parser");
require('dotenv').config()
const PORT = process.env.PORT || 5000


//connexion a la base de donné
connectDB()

//configuration du serveur
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

//Déclaration des routes
//Route utiliser pour les utilisateur
app.use('/api/user', require('./routes/userRoutes'))

//afficher les stack d'erreur en mode développement
app.use(errorHandler)

//On se connect a mongodb est on lance le serveur
mongoose.connection.once('open', () => {
    console.log('Connected to mangoDB')
    app.listen(PORT, () => {
        console.log(`Serveur lancé sur le port ${PORT}`)
    })
})

//si on a un prob de co
mongoose.connection.on('error', err => {
    console.log(`Erreur de connexion MongoDB : ${err}`)
})