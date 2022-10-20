const connection = require("../common/db");
const guid = require("../common/guid");

const logisticsDao = {
  //添加一个物流信息
  insertLogistics(logisticsObj) {
    const logistics_id = guid();
    console.log(logisticsObj.create_time);
    const sql =
      logisticsObj.create_time === "" || logisticsObj.create_time === null
        ? "insert into logistics(logistics_id, order_id, city_code, location) values(?, ?, ?, ?)"
        : "insert into logistics(logistics_id, order_id, city_code, location, create_time) values(?, ?, ?, ?, ?)";
    const param =
      logisticsObj.create_time === "" || logisticsObj.create_time === null
        ? [
            logistics_id,
            logisticsObj.order_id,
            logisticsObj.city_code,
            logisticsObj.location,
          ]
        : [
            logistics_id,
            logisticsObj.order_id,
            logisticsObj.city_code,
            logisticsObj.location,
            logisticsObj.create_time,
          ];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.affectedRows === 1) resolve("新增物流信息成功!");
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据订单Id获取订单所有物流信息
  selectLogisticsByOrderId(order_id) {
    const sql = "select * from logistics where order_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, order_id)
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = logisticsDao;
