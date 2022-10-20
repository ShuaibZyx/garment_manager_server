const connection = require("../common/db");
const result = require("../common/result");

const loginDao = {
  //通过账户查询用户Id与密码
  getPassword(account) {
    const sql = "select password from admin where account = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, account)
        .then((data) => {
          if (data.length === 1) resolve(JSON.parse(JSON.stringify(data)));
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = loginDao;
