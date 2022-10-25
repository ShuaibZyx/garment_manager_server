const connection = require("../common/db");
const guid = require("../common/guid");

const hireDao = {
  //分页获取所有租赁信息，附带id模糊查询
  selectHires(limit, offset) {
    const sql = "select * from hire limit ? offset ?";
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

  //添加一个租赁记录
  insertHire(hireObj) {
    const hire_id = guid();
    const sqls = [
      "insert into hire(hire_id, day, renter_id, owner_id, garment_id, total_price) values(?, ?, ?, ?, ?, ?)",
      "update garment set state = 2 where garment_id = ?",
    ];

    const params = [
      [
        hire_id,
        hireObj.day,
        hireObj.renter_id,
        hireObj.owner_id,
        hireObj.garment_id,
        hireObj.total_price,
      ],
      [hireObj.garment_id],
    ];
    return new Promise((resolve, reject) => {
      connection
        .transaction(sqls, params)
        .then((data) => {
          if (data.length === 2) resolve("新增租赁信息成功!");
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //获取符合条件的租赁信息总个数
  selectHireCountLike() {
    const sql = "select count(1) as total from hire";
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

  //根据Id查询单条租赁信息
  selectHireById(hire_id) {
    const sql = "select * from hire where hire_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, hire_id)
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据Id删除一条租赁记录
  deleteHireSingleById(hire_id, garment_id) {
    const sqls = [
      "delete from hire where hire_id = ?",
      "update garment set state = 1 where garment_id = ?",
    ];
    const params = [[hire_id], [garment_id]];
    return new Promise((resolve, reject) => {
      connection
        .transaction(sqls, params)
        .then((data) => {
          if (data.length === 2) resolve("删除单个租赁记录成功");
          else reject("数据库操作出现错误");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据多个Id删除多条租赁记录
  deleteHiresByIds(hireIds, garmentIds) {
    const sqls = [
      "delete from hire where hire_id in (?)",
      "update garment set state = 1 where garment_id in (?)",
    ];
    const params = [[hireIds], [garmentIds]];
    return new Promise((resolve, reject) => {
      if (hireIds.length === 0 || garmentIds.length === 0) {
        resolve([]);
        return;
      }
      connection
        .transaction(sqls, params)
        .then((data) => {
          if (data.length === 2) resolve("删除多个租赁信息成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = hireDao;
