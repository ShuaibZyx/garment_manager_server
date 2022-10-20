//引入express
var express = require("express");
//引入router
var router = express.Router();
//引入Dao层
const userService = require("../service/userService");

//获取所有用户信息
router.post("/infoes", userService.getUserInfoes);

//获取条件用户总数量
router.get("/count/:key?", userService.getUserCountKey);

//添加一个用户
router.post("/add", userService.addUser);

//冻结一个用户账号
router.post("/freeze", userService.freezeUserAccount);

//冻结一个用户账号
router.post("/thaw", userService.thawUserAccount);

//删除单个用户
router.delete("/delete/:user_id?", userService.deleteUserSingle);

//删除多个用户
router.post("/deletes", userService.deleteUsers);

//更新一个用户信息
router.post("/updateinfo", userService.updateUserInfo);

//添加一个用户地址信息
router.post("/add/address", userService.addUserAddress);

//删除一个用户地址信息
router.post("/delete/address", userService.deleteUserAddress);

//设置用户默认收货地址
router.post("/address/default", userService.updateUserDefaultAddress);

//获取用户填写服装拥有者的用户信息
router.get("/garment/:account?", userService.getUserByAccount);

//根据Id和关键字获取用户的详细地址信息
router.get("/address/:user_id?/:key?", userService.getUserAddressKey);

//判断用户输入的电话号码是否已经注册
router.get("/account/exist/:account?", userService.judgeUserAccountExist);

module.exports = router;
