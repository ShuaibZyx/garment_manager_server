//引入express
var express = require("express");
//引入router
var router = express.Router();
//引入service层
const loginService = require("../service/loginService")

router.post("/login", loginService.login)

module.exports = router