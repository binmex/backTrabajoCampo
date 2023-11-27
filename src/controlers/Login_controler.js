const { pool } = require("../db");
const jwt = require("../services/jwt")

exports.login = async (req,res) =>{
    //recoger params body
    const { nombre, contraseña } = req.body;

    if(!nombre || !contraseña){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }
    //buscar en la BD si existe
    const [row] = await pool.query(
        "select *  from Usuario where nombre = ?",
        [nombre]
      );
      if (row.length <= 0){
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    //comprobar contraseña
    //let pwd = bcryp.compareSync(contraseña, 'contraseña de la BD')
    if(contraseña != row[0].contraseña){
        return res.status(400).send({
            status: "error",
            message: "las credenciales no coinciden"
        })
    }
    //Token
    const token = jwt.createToken(row[0]);

    //devolver  datos del usuario
    return res.status(200).send({
        status: "seccess",
        message: "login exitoso",
        user:{
            name: row[0].nombre,
            cc: row[0].cc
        },
        token
    })
};