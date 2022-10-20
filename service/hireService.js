const hireDao = require("../dao/hireDao");
const garmentDao = require("../dao/garmentDao");
const userDao = require("../dao/userDao");
const result = require("../common/result");

const hireService = {
  //新增一条租赁信息
  async addHire(req, res) {
    const hireObj = req.body.hireObj;
    try {
      await hireDao.insertHire(hireObj);
      res.json(result.updateSuccess("添加租赁信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //获取所有租赁信息
  async getHires(req, res) {
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;
    try {
      const hiresRes = await hireDao.selectHires(
        pageSize,
        (pageNumber - 1) * pageSize
      );
      for (let i = 0; i < hiresRes.length; i++) {
        hiresRes[i].garment = (
          await garmentDao.selectGarmentById(hiresRes[i].garment_id)
        )[0];
        hiresRes[i].renter = (
          await userDao.selectUserById(hiresRes[i].renter_id)
        )[0];
      }
      res.json(result.selectSuccess(hiresRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //获取条件下所有租赁信息的数量
  async getHireCountKey(req, res) {
    const key = req.params.key;
    try {
      const total = await hireDao.selectHireCountLike(key);
      res.json(result.selectSuccess(total));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除单个租赁信息
  async deleteHireSingle(req, res) {
    const hire_id = req.body.hire_id;
    const garment_id = req.body.garment_id;
    try {
      await hireDao.deleteHireSingleById(hire_id, garment_id);
      res.json(result.updateSuccess("删除租赁信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除多个租赁信息
  async deleteHires(req, res) {
    const hireIds = req.body.hireIds;
    const garmentIds = req.body.garmentIds;
    try {
      await hireDao.deleteHiresByIds(hireIds, garmentIds);
      res.json(result.updateSuccess("删除多个租赁信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },
};

module.exports = hireService;
