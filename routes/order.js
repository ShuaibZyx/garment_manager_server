//引入express
var express = require("express");
//引入router
var router = express.Router();
//引入service层
const orderService = require("../service/orderService");

//添加一条新订单信息
router.post("/add", orderService.addOrder);

//获取所有订单信息
router.post("/infoes", orderService.getOrders);

//获取条件下订单信息总数量
router.get("/count", orderService.getOrderCountKey);

//删除单个订单信息
router.post("/delete", orderService.deleteOrderSingle);

//删除多个订单信息
router.post("/deletes", orderService.deleteOrders);

//获得当前订单下租赁信息中租赁人的默认地址信息
router.get(
  "/hire/renter/address/:hire_id?",
  orderService.getOrderHireRenterAddress
);

//完成订单(state = 4)
router.post("/finish", orderService.finishOrder);

//根据条件获取所有订单Id
router.get("/ids/:key?", orderService.getOrderIdsKey);

module.exports = router;
