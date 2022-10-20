module.exports = {
  //通用查询返回结构
  selectSuccess: (data = [], msg = "查询成功") => {
    return {
      msg,
      code: 200,
      data: data,
    };
  },

  //通用错误返回结构
  error(msg = "系统异常") {
    return {
      msg,
      code: 500,
      data: null,
    };
  },

  //通用更新成功返回结构
  updateSuccess(msg = "更新成功", data = []) {
    return {
      msg,
      code: 200,
      data,
    };
  },

  //通用文件上传成功返回结构
  uploadFileSuccess(file) {
    return {
      msg: "文件上传成功",
      code: 201,
      file,
    };
  },

  //通用文件上传成功返回结构
  uploadFilesSuccess(file = []) {
    return {
      msg: "文件批量上传成功",
      code: 201,
      file,
    };
  },

  //处理文件大小通用方法
  bytesToSize(bytes) {
    if (bytes === 0) return "0 B";
    var k = 1000, // or 1024
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
  },
};


