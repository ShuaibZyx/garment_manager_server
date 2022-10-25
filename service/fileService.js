const config = require("../common/dbConfig");
const fileDao = require("../dao/fileDao");
const result = require("../common/result");
//引入utf8编码模块
const utf8 = require("utf8");

const fileService = {
  //上传单个普通文件
  async uploadFile(req, res) {
    const fileUrl =
      `http://${config.db.host}:${config.port}/` +
      req.file.path;
    const filename = utf8.decode(req.file.originalname);
    const size = req.file.size;
    try {
      const insertFileRes = await fileDao.insertFile({
        filename,
        fileUrl,
        size,
      });
      var file = {
        fileId: insertFileRes,
        filename: utf8.decode(req.file.originalname),
        fileUrl,
        fileSize: req.file.size,
      };
      res.json(result.uploadFileSuccess(file));
    } catch (error) {
      res.json(result.error(error));
    }
  },
};

module.exports = fileService;
