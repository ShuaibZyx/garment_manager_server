//引入express
var express = require("express");
//引入router
var router = express.Router();
//引入service层
const hireService = require("../service/hireService");

//添加一条新租赁信息
router.post("/add", hireService.addHire);

//获取所有租赁信息信息
router.post("/infoes", hireService.getHires);

//获取条件下租赁信息总数量
router.get("/count", hireService.getHireCountKey);

//删除单个租赁信息
router.post("/delete", hireService.deleteHireSingle);

//删除多条租赁信息
router.post("/deletes", hireService.deleteHires);

module.exports = router;
