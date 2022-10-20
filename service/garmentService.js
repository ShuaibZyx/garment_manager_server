const garmentDao = require("../dao/garmentDao");
const fileDao = require("../dao/fileDao");
const result = require("../common/result");
//引入fs模块
const fs = require("fs");
//路径解析
var pathParse = require("path");

const garmentService = {
  //获取所有服装信息
  async getGarmentInfoes(req, res) {
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;
    const key = req.body.key;
    try {
      const garmentInfoerRes = await garmentDao.selectGarmentInfoes(
        pageSize,
        (pageNumber - 1) * pageSize,
        key
      );
      res.json(result.selectSuccess(garmentInfoerRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //获取条件下所有服装的数量
  async getGarmentCountKey(req, res) {
    const key = req.params.key;
    try {
      const total = await garmentDao.selectGarmentCountLike(key);
      res.json(result.selectSuccess(total));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //新增服装信息
  async addGarment(req, res) {
    const garment = req.body.garmentObj;
    try {
      await garmentDao.insertGarment(garment);
      res.json(result.updateSuccess("添加服装信息成功"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除单个服装
  async deleteGarmentSingle(req, res) {
    const garment_id = req.body.garment_id;
    const fileId = req.body.file_id;
    const fileUrl = req.body.image_url;
    try {
      var name = fileUrl.substring(fileUrl.indexOf("static"));
      var path = pathParse.normalize(
        __dirname.slice(0, __dirname.indexOf("service")) + name
      );
      fs.unlinkSync(path);
      await garmentDao.deleteGarmentSingle(garment_id);
      await fileDao.deleteFileById(fileId);
      res.json(result.updateSuccess("删除服装成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除多个服装信息
  async deleteGarments(req, res) {
    const garmentIds = req.body.garmentIds;
    const fileIds = req.body.fileIds;
    try {
      const imageUrlsRes = await garmentDao.selectImageUrlsByIds(garmentIds);
      var fileUrlsArr = [];
      imageUrlsRes.forEach((url) => {
        var path = pathParse.normalize(
          __dirname.slice(0, __dirname.indexOf("service")) +
            url.image_url.substring(url.image_url.indexOf("static"))
        );
        fileUrlsArr.push(path);
      });
      fileUrlsArr.forEach((path) => {
        fs.unlinkSync(path);
      });
      await fileDao.deleteFilesByFileId(fileIds);
      await garmentDao.deleteGarmentsByIds(garmentIds);
      res.json(result.updateSuccess("删除多个服装信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //切换服装状态
  async changeGarmentState(req, res) {
    const garment_id = req.body.garment_id;
    const type = req.body.type;
    var state = type === "上架" ? 1 : type === "下架" ? 0 : 2;
    try {
      await garmentDao.updateGarmentState(garment_id, state);
      res.json(result.updateSuccess("切换服装状态成功"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //根据单个Id获取服装信息
  async getGarmentById(req, res) {
    const garment_id = req.params.garment_id;
    try {
      const garmentRes = await garmentDao.selectGarmentById(garment_id);
      res.json(result.selectSuccess(garmentRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },
};

module.exports = garmentService;
