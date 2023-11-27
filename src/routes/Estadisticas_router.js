const { Router } = require("express");
const check = require("../middlewares/auth");
const { getRotacion } = require("../controlers/Estadisticas_controler");
const{getGanancias}=require("../controlers/Estadisticas_controler");

const router = Router();

router.get("/rotacion/:id/:dateInit/:dateEnd",getRotacion);
router.get("/ganancia/:id/:dateInit/:dateEnd",getGanancias);

module.exports = router