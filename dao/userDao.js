const guid = require("../common/guid");
const connection = require("../common/db");

const userDao = {
  //分页获取所有用户的账户以及个人信息，附带电话号码查询
  selectUserInfoes(limit, offset, key = "") {
    const sql =
      "select * from user_account a, user_info i where a.user_id = i.user_id" +
      (key === "" ? "" : " and a.account like ?") +
      " limit ? offset ?";
    const param =
      key === "" ? [limit, offset] : ["%" + key + "%", limit, offset];
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

  //查询符合条件的用户总个数
  selectUserCountLike(key = "") {
    const sql =
      "select count(1) as total from user_account" +
      (key === "" ? "" : " where account like concat('%', ?, '%')");
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

  //查询某个用户所拥有的所有收货地址信息
  selectUserAddresses(user_id) {
    const sql = "select * from address where user_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, user_id)
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据用户账号模糊查询用户id,账号与昵称
  selectUserByAccount(account) {
    const sql =
      "select user_id, account from user_account where account like ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, "%" + account + "%")
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据用户Id查询用户的账号以及其它信息
  selectUserById(user_id) {
    const sql =
      "select a.account, i.* from user_account a, user_info i where a.user_id = i.user_id and a.user_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, user_id)
        .then((data) => {
          if (data.length >= 0) resolve(JSON.parse(JSON.stringify(data)));
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //新增一个用户
  insertUser(userObj) {
    const user_id = guid();
    const address_id = guid();
    const sqls = [
      "insert into user_account(user_id, account, password) values(?, ?, ?)",
      "insert into user_info(user_id, nickname, city_code, gender, age, favourite, birthday, email) values(?, ?, ?, ?, ?, ?, ?, ?)",
      "insert into address(address_id, user_id, city_code, location, state) values(?, ?, ?, ?, ?)",
    ];
    const params = [
      [user_id, userObj.account, userObj.password],
      [
        user_id,
        userObj.nickname,
        userObj.city_code,
        userObj.gender,
        userObj.age,
        userObj.favourite,
        userObj.birthday,
        userObj.email,
      ],
      [address_id, user_id, userObj.city_code, "", 1],
    ];
    return new Promise((resolve, reject) => {
      connection
        .transaction(sqls, params)
        .then((data) => {
          if (data.length === 3) resolve("插入成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //冻结/解冻用户的账号
  updateUserAvailable(user_id, type = "freeze") {
    const sql = "update user_account set available = ? where user_id = ?";
    const available = type === "freeze" ? 0 : 1;
    return new Promise((resolve, reject) => {
      connection
        .query(sql, [available, user_id])
        .then((data) => {
          if (data.affectedRows === 1) resolve("更新成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //删除一个用户
  deleteUserSingleById(user_id) {
    const sql = "delete from user_account where user_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, user_id)
        .then((data) => {
          if (data.affectedRows === 1) resolve("删除单个用户成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //删除多个用户
  deleteUsersByIds(userIds) {
    const sql = "delete from user_account where user_id in (?)";
    return new Promise((resolve, reject) => {
      if (userIds.length === 0) {
        resolve([]);
        return;
      }
      connection
        .query(sql, [userIds])
        .then((data) => {
          if (data.affectedRows >= 1) resolve("删除多个用户成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //更新用户信息
  updateUserInfoById(userInfo) {
    const sql =
      "update user_info set nickname = ?, city_code = ?, gender = ?, age = ?, favourite = ?, birthday = ?, email = ? where user_id = ?";
    const param = [
      userInfo.nickname,
      userInfo.city_code,
      userInfo.gender,
      userInfo.age,
      userInfo.favourite,
      userInfo.birthday,
      userInfo.email,
      userInfo.user_id,
    ];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.affectedRows === 1) resolve("更新用户信息成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //添加用户收货地址
  insertUserAddress(addressObj) {
    const address_id = guid();
    const sql =
      "insert into address(address_id, user_id, city_code, location) values(?, ?, ?, ?)";
    const param = [
      address_id,
      addressObj.user_id,
      addressObj.city_code,
      addressObj.location,
    ];
    return new Promise((resolve, reject) => {
      connection
        .query(sql, param)
        .then((data) => {
          if (data.affectedRows === 1) resolve("插入地址成功");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //删除用户收货地址
  deleteUserAddress(address_id) {
    const sql = "delete from address where address_id = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, address_id)
        .then((data) => {
          if (data.affectedRows === 1) resolve("删除用户收货地址成功!");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //设置当前默认收获地址
  updateUserDefaultAddress(address_id, user_id) {
    const sqls = [
      "update address set state = 0 where user_id = ?",
      "update address set state = 1 where address_id = ?",
    ];
    const params = [[user_id], [address_id]];
    return new Promise((resolve, reject) => {
      connection
        .transaction(sqls, params)
        .then((data) => {
          if (data.length === 2) resolve("更新用户默认地址成功!");
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据用户Id以及关键字模糊获取用户地址信息
  selectUserAddressKey(key, user_id) {
    console.log(key);
    const sql =
      key === "" || key === undefined
        ? "select * from address where user_id = ?"
        : "select * from address where user_id = ? and location like concat ('%', ?, '%')";
    const param = key === "" || key === undefined ? [user_id] : [user_id, key];
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

  //查询用户输入的账号是否已经存在
  selectUserAccountExisted(account) {
    const sql = "select user_id from user_account where account = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, account)
        .then((data) => {
          if (data.length >= 1) resolve(true);
          else reject("数据库操作出现错误!");
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = userDao;
