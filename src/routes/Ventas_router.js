const { getFacturas, getFactura, addVenta, getProductos } = require("../controlers/Ventas_controler")
const { Router } = require("express")
const check = require("../middlewares/auth")

const router = Router();
router.get("/visualizar", check.auth, getFacturas);

router.get("/visualizar/:id", check.auth, getFactura);
//obtener productos en genearar
router.get("/getproductos",check.auth,getProductos)

router.post("/addventa", addVenta)

module.exports = router