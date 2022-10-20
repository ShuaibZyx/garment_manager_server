//引入express
var express = require("express");
//引入router
var router = express.Router();
//获取上传文件的配置
const { uploadImg } = require("../common/uploadConfig");
//获取Dao层文件
const fileService = require("../service/fileService");

//上传文件
router.post("/upload", uploadImg().single("file"), fileService.uploadFile);

module.exports = router;
