var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hi991016:QWEasdzxc123@hi-n4g5b.mongodb.net/dbcafe";
var ProductDAO = {
  insert: function (product) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbcafe");
        dbo.collection("cafe").insertOne(product, function (err, res) {
          if (err) return reject(err);
          resolve(res.insertedCount > 0 ? true : false);
          db.close();
        });
      });
    });
  },
  getAll: function () {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbcafe");
        var query = {};
        dbo.collection("cafe").find(query).toArray(function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  getDetails: function (id) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dbcafe");
        var ObjectId = require('mongodb').ObjectId;
        var query = { _id: ObjectId(id) };
        dbo.collection("cafe").findOne(query, function (err, res) {
          if (err) return reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  // update: function (product) {
  //   return new Promise(function (resolve, reject) {
  //     MongoClient.connect(url, function (err, db) {
  //       if (err) throw err;
  //       var dbo = db.db("dbcafe");
  //       var ObjectId = require('mongodb').ObjectId;
  //       var query = { _id: ObjectId(product.id) };
  //       var newvalues = { $set: { name: product.name, price: product.price, image: product.image, category: product.category } };
  //       dbo.collection("cafe").updateOne(query, newvalues, function (err, res) {
  //         if (err) reject(err);
  //         resolve(res.result.nModified > 0 ? true : false); 
  //         db.close();
  //       });
  //     });
  //   });
  // },
  selectByCategory: function (catname) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) reject(err);
        var dbo = db.db("dbcafe");
        var query = { category: catname };
        dbo.collection("cafe").find(query).toArray(function (err, res) {
          if (err) reject(err);
          resolve(res);
          db.close();
        });
      });
    });
  },
  delete: function (id) {
    return new Promise(function (resolve, reject) {
      MongoClient.connect(url, function (err, db) {
        if (err) reject(err);
        var dbo = db.db("dbcafe");
        var ObjectId = require('mongodb').ObjectId;
        var query = { _id: ObjectId(id) };
        dbo.collection("cafe").deleteOne(query, function (err, res) {
          if (err) reject(err);
          resolve(res.result.n > 0 ? true : false);
          db.close();
        });
      });
    });
  }
};

module.exports = ProductDAO;