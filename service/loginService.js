var result = require("../common/result");
var jwt = require("../common/jwt");
const CryptoJS = require("../common/crypto");
const { Base64 } = require("js-base64");
const loginDao = require("../dao/loginDao")

const loginService = {
  async login(req, res) {
    //1.获取用户上传的参数
    var user = req.body;
    user.password = CryptoJS.decrypt(Base64.decode(user.password));
    try {
      //2.获取用户的id与密码
      const getPasswordRes = await loginDao.getPassword(user.account);
      //3.判断用户是否注册
      if (getPasswordRes.length === 0) {
        res.json(result.error("该账号未注册"));
        return;
      }
      //4.判断用户密码是否正确
      if (getPasswordRes[0].password !== user.password) {
        res.json(result.error("密码错误"));
        return;
      }
      //5.密码正确则生成token并设置登录状态
      var token = jwt.generateToken(user, user.expiresIn);
      //6.响应信息
      res.json(result.selectSuccess(token, "登陆成功"));
    } catch (error) {
      //出错则响应错误信息
      res.json(result.error(error));
    }
  },
};

module.exports = loginService;
