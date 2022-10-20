//引入express
var express = require("express");
//引入router
var router = express.Router();
//引入service层
const logisticsService = require("../service/logisticsService");

//添加一条物流信息
router.post("/add", logisticsService.addLogistics);

//根据订单Id获取所有的物流信息
router.get("/infoes/:order_id?", logisticsService.getLogisticsByOrderId);

module.exports = router;
