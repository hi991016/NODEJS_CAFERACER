var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hi991016:QWEasdzxc123@hi-n4g5b.mongodb.net/dbcafe";
var CategoryDAO = {
  selectAll: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) reject(err);
        var dbo = db.db("dbcafe");
        var query = {};
        dbo.collection("categories").find(query).toArray(function (err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  }
};
module.exports = CategoryDAO;