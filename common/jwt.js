// 引入模块依赖
const jwt = require("jsonwebtoken");
let key = "fuTkisMQQ2j1ESC0cbaQen1ZWmkMdvLx";
let expir = 4 * 60 * 60; //4小时(token默认过期的时间)

/**
 * user: 用户对象(包括账号与密码)
 * expiresIn: token过期时间(默认为4小时)
 */
const generateToken = function (user, expiresIn = expir) {
  let token = jwt.sign({ user }, key, { expiresIn: expiresIn });
  return token;
};

// 校验token(错误会抛出异常)
const verifyToken = function (token) {
  try {
    let tokenKey = jwt.verify(token, key);
    var verifyResult = {
      access: true,
      data: tokenKey,
    };
    return verifyResult;
  } catch (e) {
    var verifyResult = {
      access: false,
      data: e.message,
    };
    return verifyResult;
  }
};

module.exports = {
  verifyToken,
  generateToken,
};
