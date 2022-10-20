const userDao = require("../dao/userDao");
const result = require("../common/result");

const userService = {
  //分页获取所有用户信息
  async getUserInfoes(req, res) {
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;
    const key = req.body.key;
    try {
      const userInfoesRes = await userDao.selectUserInfoes(
        pageSize,
        (pageNumber - 1) * pageSize,
        key
      );
      for (let i = 0; i < userInfoesRes.length; i++) {
        var userAddresses = await userDao.selectUserAddresses(
          userInfoesRes[i].user_id
        );
        for (let j = 0; j < userAddresses.length; j++) {
          userAddresses[j].city_code = userAddresses[j].city_code.split("-");
          if (userAddresses[j].state === 1) {
            userInfoesRes[i].defaultAddress = j + 1;
          }
        }
        userInfoesRes[i].addresses = userAddresses;
      }
      res.json(result.selectSuccess(userInfoesRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //获取条件下所有用户的数量
  async getUserCountKey(req, res) {
    const key = req.params.key;
    try {
      const total = await userDao.selectUserCountLike(key);
      res.json(result.selectSuccess(total));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //添加一个用户
  async addUser(req, res) {
    const userObj = req.body.userObj;
    try {
      await userDao.insertUser(userObj);
      res.json(result.updateSuccess("添加用户成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //冻结用户账号
  async freezeUserAccount(req, res) {
    const user_id = req.body.user_id;
    try {
      await userDao.updateUserAvailable(user_id, "freeze");
      res.json(result.updateSuccess("冻结用户成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //解冻用户账号
  async thawUserAccount(req, res) {
    const user_id = req.body.user_id;
    try {
      await userDao.updateUserAvailable(user_id, "thaw");
      res.json(result.updateSuccess("解冻用户成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除单个用户
  async deleteUserSingle(req, res) {
    const user_id = req.params.user_id;
    try {
      await userDao.deleteUserSingleById(user_id);
      res.json(result.updateSuccess("删除用户成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除多个用户
  async deleteUsers(req, res) {
    const userIds = req.body.userIds;
    try {
      await userDao.deleteUsersByIds(userIds);
      res.json(result.updateSuccess("删除多个用户成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //更新一个用户信息
  async updateUserInfo(req, res) {
    const userInfo = req.body.userInfo;
    try {
      await userDao.updateUserInfoById(userInfo);
      res.json(result.updateSuccess("更新用户信息成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //添加一个用户收获地址
  async addUserAddress(req, res) {
    const userAddressObj = req.body;
    try {
      await userDao.insertUserAddress(userAddressObj);
      res.json(result.updateSuccess("添加用户地址成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //删除用户收货地址
  async deleteUserAddress(req, res) {
    const address_id = req.body.address_id;
    try {
      await userDao.deleteUserAddress(address_id);
      res.json(result.updateSuccess("用户收货地址删除成功!"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //通过账号模糊查询用户的id,账号和昵称
  async getUserByAccount(req, res) {
    const account = req.params.account;
    try {
      const userRes = await userDao.selectUserByAccount(account);
      res.json(result.selectSuccess(userRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //更换用户的默认收获地址
  async updateUserDefaultAddress(req, res) {
    const address_id = req.body.address_id;
    const user_id = req.body.user_id;
    try {
      await userDao.updateUserDefaultAddress(address_id, user_id);
      res.json(result.updateSuccess("更新用户默认地址成功"));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //根据用户Id
  async getUserAddressKey(req, res) {
    const user_id = req.params.user_id;
    const key = req.params.key;
    try {
      const addressRes = await userDao.selectUserAddressKey(key, user_id);
      res.json(result.selectSuccess(addressRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },

  //判断用户账号是否已经注册
  async judgeUserAccountExist(req, res) {
    const account = req.params.account;
    try {
      const existRes = await userDao.selectUserAccountExisted(account);
      res.json(result.selectSuccess(existRes));
    } catch (error) {
      res.json(result.error(error));
    }
  },
};

module.exports = userService;
