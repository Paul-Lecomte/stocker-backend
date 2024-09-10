const allowedOrigins = require('./allowedOrigins')
const {all} = require("express/lib/application");

//fonction pour les options cors qui autorise ou non les sites d'accèder à notre API
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin){ //pas d'origin = applicaiotn windows
            callback(null, true)
        } else {
            callback(new Error('Non autorisé par CORS'))
        }
    },
    credentials: true,
    optionsSuccesStatus: 200
}

module.exports = corsOptions