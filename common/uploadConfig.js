const multer = require("multer");
var moment = require("moment");
const utf8 = require("utf8");
//multer配置
const upload = (path  = "/uploads", files = 5, fileSize = 100 * 1024 * 1024) => {
  return multer({
    storage: multer.diskStorage({
      destination: `files${path}/${moment().format("YYYYMMDD")}`,
      filename: function (req, file, cb) {
        cb(
          null,
          //注意，el-uplod发送来的文件名莫名为二进制乱码，暂时不知道原因，使用utf8中间件强行转换编码
          `${
            moment().format("HHmmss") * (Math.ceil(Math.random() * 5) + 1)
          }-${utf8.decode(file.originalname)}`
        );
      },
    }),
    limits: {
      files, // 最大同时上传文件数目
      fileSize, //每个文件的最大大小
    },
  });
};

const uploadImg = (path  = "/garment", fileSize = 1 * 1024 * 1024) => {
  return multer({
    storage: multer.diskStorage({
      destination: `static/images${path}/${moment().format("YYYYMMDD")}`,
      filename: function (req, file, cb) {
        cb(
          null,
          //注意，el-uplod发送来的文件名莫名为二进制乱码，暂时不知道原因，使用utf8中间件强行转换编码
          `${
            moment().format("HHmmss") * (Math.ceil(Math.random() * 5) + 1)
          }-${utf8.decode(file.originalname)}`
        );
      },
    }),
    limits: {
      files: 1, // allow up to 5 files per request,
      fileSize,
    },
  });
}
module.exports = { upload, uploadImg };
