const express = require("express");
// 获取启动参数
const config = require("./common/dbConfig");
const logger = require("morgan"); //日志模块
const cors = require("cors");
const mount = require("mount-routes");
const jwt = require("./common/jwt");

const app = express();
var path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev")); //调用日志，配置为dev模式
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "static")));

//token权限拦截控制
app.use((req, res, next) => {
  // 登陆和注册请求无需token，其它请求需要验证权限
  if (
    req.url !== "/admin/login" 
  ) {
    //获取请求头携带的token
    let token = req.headers.token;
    //验证token是否过期
    let result = jwt.verifyToken(token);
    // 如果验证通过就next，否则就返回登陆信息不正确(code == 100就是异常情况)
    if (result.code == 100 || !result.access) { 
      res.json({
        msg: "登录已过期,请重新登录",
        code: 401,
        data: null,
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

//配置路由路径
mount(app, "./routes", true);

app.listen(config.port, () => {
  console.log(`express server listening ---> ${config.db.host}:${config.port}`);
  console.log(`数据库:${config.db.database}`);
  console.log("本系统为学习技术所设计,作者QQ:2631667689");
});
