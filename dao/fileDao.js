const connection = require("../common/db");
const uuid = require("uuid");

const fileDao = {
  //上传单个普通文件
  insertFile(file) {
    const fileId = uuid.v4();
    const sql =
      "insert into files(fileId, originalfilename, fileUrl, size) values(?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, [fileId, file.filename, file.fileUrl, file.size])
        .then((data) => {
          if (data.affectedRows === 1) resolve(fileId);
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //删除一个文件的记录信息
  deleteFileById(fileId) {
    const sql = "delete from files where fileId = ?";
    return new Promise((resolve, reject) => {
      connection
        .query(sql, fileId)
        .then((data) => {
          if (data.affectedRows === 1) resolve("删除文件信息成功!");
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },

  //根据fileId删除多个文件的记录信息
  deleteFilesByFileId(fileIds) {
    const sql = "delete from files where fileId in (?)";
    return new Promise((resolve, reject) => {
      if (fileIds.length === 0) {
        resolve([]);
        return;
      }
      connection
        .query(sql, [fileIds])
        .then((data) => {
          if (data.affectedRows > 0) resolve("删除多个文件信息成功!");
          else reject();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  },
};

module.exports = fileDao;
