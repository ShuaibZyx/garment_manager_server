const result = require("../common/result");
const orderDao = require("../dao/orderDao");
const hireDao = require("../dao/hireDao");
const garmentDao = require("../dao/garmentDao");
const userDao = require("../dao/userDao");

const orderService = {
  //获取所有订单信息
  async getOrders(req, res) {
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;
    const key = req.body.key;
    try {
      const ordersRes = await orderDao.selectOrders(
        pageSize,
        (pageNumber - 1) * pageSize,
        key
      );
      for (let i = 0; i < ordersRes.length; i++) {
        if (ordersRes[i].hire_id) {
          ordersRes[i].hireInfo = (
            await hireDao.selectHireById(ordersRes[i].hire_id)
          )[0];
          if (ordersRes[i].hireInfo !== undefined) {
            ordersRes[i].garment = (
              await garmentDao.selectGarmentById(
                ordersRes[i].hireInfo.garment_id
              )
            )[0];
            ordersRes[i].renter = (
              await userDao.selectUserById(ordersRes[i].hireInfo?.renter_id)
            )[0];
            ordersRes[i].owner = (
              await userDao.selectUserById(ordersRes[i].hireInfo?.renter_id)
            )[0];
          }
        }
      }
      res.json(result.selectSuccess(ordersRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //新增一条订单信息
  async addOrder(req, res) {
    const orderObj = req.body.orderObj;
    try {
      await orderDao.insertOrder(orderObj);
      res.json(result.updateSuccess("添加订单信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //获取条件下所有订单信息的数量
  async getOrderCountKey(req, res) {
    try {
      const total = await orderDao.selectOrderCountLike();
      res.json(result.selectSuccess(total));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除单个订单信息
  async deleteOrderSingle(req, res) {
    const order_id = req.body.order_id;
    try {
      await orderDao.deleteOrderSingleById(order_id);
      res.json(result.updateSuccess("删除订单信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //获得当前订单下租赁信息中租赁人的默认地址信息
  async getOrderHireRenterAddress(req, res) {
    const hire_id = req.params.hire_id;
    try {
      const address = await orderDao.selectUserAddressIdByHireId(hire_id);
      res.json(result.selectSuccess(address));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除多个租赁信息
  async deleteOrders(req, res) {
    const orderIds = req.body.orderIds;
    try {
      await orderDao.deleteOrdersByIds(orderIds);
      res.json(result.updateSuccess("删除多个订单信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //修改订单状态为已完成
  async finishOrder(req, res) {
    const order_id = req.body.order_id;
    try {
      await orderDao.updateStateById(order_id);
      res.json(result.updateSuccess("修改订单状态成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //根据条件获取所有订单Id
  async getOrderIdsKey(req, res) {
    const key = req.params.key;
    try {
      const orderIds = await orderDao.selectOrderIdsKey(key);
      res.json(result.selectSuccess(orderIds));
    } catch (error) {
      res.json(result.error(error));
    }
  },
};

module.exports = orderService;
