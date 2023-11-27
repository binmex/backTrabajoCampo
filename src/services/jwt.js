//importar dependencias
const jwt = require("jwt-simple")
const moment = require("moment")

//clave secreta
const secret = "CLAVE_SECRETA_AwIE_78826913";

//crear funcion para generar token
const createToken = (user)=>{
    const payload = {
        id: user.cc,
        name: user.nombre,
        iat: moment().unix(),
        exp: moment().add(1,"days").unix()
    };
//devolver token codificado
return jwt.encode(payload, secret);
}

module.exports = {
    secret,
    createToken
}