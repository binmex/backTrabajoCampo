//importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

//importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//funcion de autenticacion
exports.auth = (req, res, next) => {
  //comprobara si llega la cabecera de autenticacion
  //console.log("valor ennn"+req.headers.authorization)
  if (!req.headers.authorization) {
    return res.status(403).send({
      status: "error",
      message: "la peticion no tiene la cabecera de autenticación",
    });
  }
  //limpiar token
  let token = req.headers.authorization.replace(/['"]+/g, "");
  //decodificar el token
  try {
    let payload = jwt.decode(token, secret);

    //comprobar expiracion
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({
        status: "error",
        message: "Token expirado",
      });
    }
    //datos de usuario a la request
    req.user = payload;
  } catch (error) {
    return res.status(404).send({
      status: "error",
      message: "Token invalido",
      error,
    });
  }

  //pasar ejecucion de accion
  next();
};
