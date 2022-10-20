const guid = require("../common/guid");
const connection = require("../common/db");

const garmentDao = {
  //插入一个新服装信息
  insertGarment(garment) {
    const garment_id = guid();
    const sql =
      "insert into garment(garment_id, name, category, description, hire_price, value, owner_id, size, color, file_id, image_url, hire_time_min, hire_time_max, state) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const param = [
      garment_id,
      garment.name,
      garment.category,
      garment.description,
      garment.hire_price,
      garment.value,
      garment.owner_id,
      garment.size,
      garment.color,
      garment.file_id,
      garment.image_url,
      garment.hire_time_min,
      garment.hire_time_max,
      garment.state,
    ];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.affectedRows === 1) resolve("插入成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //分页获取所有服装信息，附带服装名称查询
  selectGarmentInfoes(limit, offset, key = "") {
    const sql =
      "select * from garment" +
      (key === "" ? "" : " where name like concat('%', ?, '%')") +
      " limit ? offset ?";
    const param = key === "" ? [limit, offset] : [key, limit, offset];
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

  //查询符合条件的服装总个数
  selectGarmentCountLike(key = "") {
    const sql =
      "select count(1) as total from garment" +
      (key === "" ? "" : " where name like concat('%', ?, '%')");
    return new Promise((resolve, reject) => {
      connection
        .query(sql, key)
        .then((data) => {
          if (data.length === 1) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据Id获取多个服装封面Url
  selectImageUrlsByIds(garmentIds) {
    const sql = "select image_url from garment where garment_id in (?)";
    return new Promise((resolve, reject) => {
      if (garmentIds.length === 0) {
        resolve([]);
        return;
      }
      connection
        .query(sql, [garmentIds])
        .then((data) => {
          if (data.length >= 1) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据Id查询单个服装信息
  selectGarmentById(garment_id) {
    const sql = "select * from garment where garment_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, garment_id)
        .then((data) => {
          if (data.length === 1) resolve(JSON.parse(JSON.stringify(data)));
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //删除一个服装
  deleteGarmentSingle(garment_id) {
    const sql = "delete from garment where garment_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, garment_id)
        .then((data) => {
          if (data.affectedRows === 1) resolve("删除单个服装成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //删除多个服装
  deleteGarmentsByIds(garmentIds) {
    const sql = "delete from garment where garment_id in (?)";
    return new Promise((resolve, reject) => {
      if (garmentIds.length === 0) {
        resolve([]);
        return;
      }
      connection
        .query(sql, [garmentIds])
        .then((data) => {
          if (data.affectedRows >= 1) resolve("删除多个服装信息成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //更新服装的state状态
  updateGarmentState(garment_id, state) {
    const sql = "update garment set state = ? where garment_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, [state, garment_id])
        .then((data) => {
          if (data.affectedRows === 1) resolve("更新服装状态成功!");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = garmentDao;
