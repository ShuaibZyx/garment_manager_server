//引入express
var express = require("express");
//引入router
var router = express.Router();

const garmentService = require("../service/garmentService");

//获取所有服装
router.post("/infoes", garmentService.getGarmentInfoes);

//获取服装总数量
router.get("/count/:key?", garmentService.getGarmentCountKey);

//新增一个服装
router.post("/add", garmentService.addGarment);

//删除单个服装
router.post("/delete", garmentService.deleteGarmentSingle);

//删除多个服装
router.post("/deletes", garmentService.deleteGarments);

//切换服装状态
router.post("/state", garmentService.changeGarmentState);

//通过Id获取单个服装信息
router.get("/info/:garment_id?", garmentService.getGarmentById);

module.exports = router;
