const { Router } = require("express");
const { login } = require("../controlers/Login_controler");

const router = Router();
//login
router.post("/succes", login);

module.exports = router