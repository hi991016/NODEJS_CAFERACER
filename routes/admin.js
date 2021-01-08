//CLI: npm install multer --save

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://hi991016:QWEasdzxc123@hi-n4g5b.mongodb.net/dbcafe";

var express = require('express');
var router = express.Router();
// middleware
var multer = require('multer');
var upload = multer({});
// daos
var AdminDAO = require("../daos/AdminDAO.js");
var OrderDAO = require("../daos/OrderDAO.js");
var ProductDAO = require("../daos/ProductDAO.js");

// routes
router.get('/', function (req, res) {
  res.redirect('/admin/login');
});
router.get('/home', function (req, res) {
  if (req.session.admin) {
    res.render('../views/admin/home.ejs');
  } else {
    res.redirect('./login');
  }
});
// admin
router.get('/login', function (req, res) {
  res.render('../views/admin/login.ejs');
});
router.post('/login', async function (req, res) {
  var username = req.body.txtUsername;
  var password = req.body.txtPassword;
  var admin = await AdminDAO.get(username, password);
  if (admin) {
    req.session.admin = admin;
    res.redirect('/admin/home');
  } else {
    res.redirect('/admin/login');
  }
});
router.get('/logout', function (req, res) {
  delete req.session.admin;
  res.redirect('./home');
});

router.get('/addproduct', function (req, res) {
  res.render('admin/addproduct.ejs');
});


router.post('/addproduct', upload.single('fileImage'), async function (req, res) {
  var name = req.body.txtName;
  var price = parseInt(req.body.txtPrice);
  var category = req.body.cmbCategory;
  if (req.file) {
    var image = req.file.buffer.toString('base64');
    var product = { name: name, price: price, category: category, image: image };
    var result = await ProductDAO.insert(product);
    if (result) {
      res.redirect("/admin/listproducts");
    } else {
      res.send('SORRY BABY!');
    }
  }
});

router.get('/listproducts', async function (req, res) {
  var products = await ProductDAO.getAll();
  var id = req.query.id; // /listorders?id=XXX
  var product = await ProductDAO.getDetails(id);
  res.render('admin/listproducts.ejs', { prod: product, prods: products });
});

router.get('/listorders', async function (req, res) {
  var orders = await OrderDAO.getAll();
  var id = req.query.id; // /listorders?id=XXX
  var order = await OrderDAO.getDetails(id);
  res.render('admin/listorders.ejs', { orders: orders, order: order });
});

router.get('/updatestatus', async function (req, res) {
  var id = req.query.id;
  var status = req.query.status;
  var result = await OrderDAO.update(id, status);
  res.redirect('/admin/listorders');
});
router.get('/:id', function (req, res) {
  var id = req.params.id;
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db('dbcafe');
    var ObjectId = require('mongodb').ObjectID;
    var query = { _id: ObjectId(id) };
    dbo.collection('cafe').findOne(query, function (err1, result) {
      if (err1) throw err1;
      var link = "data:image/jpeg;base64," + result.image;
      result.image = link;
      res.render('admin/updateproduct.ejs', { product: result });
    });
  });

}),
  router.post('/updateproduct/:id', upload.single('fileImage'), (req, res, next) => {
    var id = req.params.id;
    var name = req.body.txtName;
    var price = parseInt(req.body.txtPrice);
    var category = req.body.cmbCategory;
    if (!req.file) {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('dbcafe');
        var ObjectId = require('mongodb').ObjectID;
        var query = { _id: ObjectId(id) };
        var newValues = { $set: { name: name, price: price, category: category } };
        dbo.collection('cafe').updateOne(query, newValues, function (err, result) {
          if (err) throw err;
          res.redirect("/admin/listproducts");
        });
      });
    }
    if (req.file) {
      var image = req.file.buffer.toString('base64');
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db('dbcafe');
        var ObjectId = require('mongodb').ObjectID;
        var query = { _id: ObjectId(id) };
        var newValues = { $set: { name: name, price: price, category: category, image: image } };
        dbo.collection('cafe').updateOne(query, newValues, function (err, result) {
          if (err) throw err;
          res.redirect("/admin/listproducts");
        });
      });
    }
  }),
  router.post('/deleteproduct/:id', function (req, res) {
    var id = req.params.id;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db('dbcafe');
      var ObjectId = require('mongodb').ObjectID;
      var query = { _id: ObjectId(id) };
      dbo.collection('cafe').deleteOne(query, function (err, result) {
        if (err) throw err;
        res.redirect("/admin/listproducts");
      });
    });
  });

module.exports = router;