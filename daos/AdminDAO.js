var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hi991016:QWEasdzxc123@hi-n4g5b.mongodb.net/dbcafe";
var AdminDAO = {
  get: function (username, password) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbcafe");
        var query = { username: username, password: password };
        dbo.collection("admin").findOne(query, function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};
module.exports = AdminDAO;