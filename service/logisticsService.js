const result = require("../common/result");
const logisticsDao = require("../dao/logisticsDao");

const logisticsService = {
  //添加一条物流信息
  async addLogistics(req, res) {
    const logisticsObj = req.body.logisticsObj;
    try {
      await logisticsDao.insertLogistics(logisticsObj);
      res.json(result.updateSuccess("添加物流信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //根据订单Id查询物流信息
  async getLogisticsByOrderId(req, res) {
    const order_id = req.params.order_id;
    try {
      const logisticsRes = await logisticsDao.selectLogisticsByOrderId(
        order_id
      );
      res.json(result.selectSuccess(logisticsRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },
};

module.exports = logisticsService;
