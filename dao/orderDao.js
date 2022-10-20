const connection = require("../common/db");
const guid = require("../common/guid");

const orderDao = {
  //分页获取所有订单信息，附带id模糊查询
  selectOrders(limit, offset) {
    const sql = "select * from orders limit ? offset ?";
    const param = [limit, offset];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //添加一个订单记录
  insertOrder(orderObj) {
    const order_id = guid();
    const sql =
      "insert into orders(order_id, cost, hire_id, state, express_company, express_id, location_send, location_receive) values(?, ?, ?, ?, ?, ?, ?, ?)";
    const param = [
      order_id,
      orderObj.cost,
      orderObj.hire_id,
      orderObj.state,
      orderObj.express_company,
      orderObj.express_id,
      orderObj.location_send,
      orderObj.location_receive,
    ];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.affectedRows === 1) resolve("新增订单信息成功!");
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //获取符合条件的订单信息总个数
  selectOrderCountLike() {
    const sql = "select count(1) as total from orders";
    return new Promise((resolve, reject) => {
      connection
        .query(sql)
        .then((data) => {
          if (data.length === 1) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据Id删除一条租赁记录
  deleteOrderSingleById(order_id) {
    const sql = "delete from orders where order_id = ?";
    const param = [order_id];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.affectedRows === 1) resolve("删除单个订单记录成功");
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据租赁Id获取租赁用户的当前默认收货地址
  selectUserAddressIdByHireId(hire_id) {
    const sql =
      "select * from address where state = 1 and user_id = (select renter_id from hire where hire_id = ?)";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, hire_id)
        .then((data) => {
          if (data.length === 1) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据多个Id删除多条订单记录
  deleteOrdersByIds(orderIds) {
    const sql = "delete from orders where order_id in (?)";
    return new Promise((resolve, reject) => {
      if (orderIds.length === 0) {
        resolve([]);
        return;
      }
      connection
        .query(sql, [orderIds])
        .then((data) => {
          if (data.affectedRows >= 1) resolve("删除多个订单信息成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据Id修改某条订单状态为已完成(state = 4)
  updateStateById(order_id) {
    const sql = "update orders set state = 4 where order_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, order_id)
        .then((data) => {
          if (data.affectedRows === 1) resolve("订单状态修改成功");
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据条件获取所有订单列表
  selectOrderIdsKey(key) {
    const sql =
      key !== undefined
        ? "select order_id from orders where order_id like concat('%', ?, '%')"
        : "select order_id from orders";
    const param = key !== undefined ? [key] : [];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = orderDao;
