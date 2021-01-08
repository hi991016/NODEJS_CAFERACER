var express = require('express');
var router = express.Router();
// daos
var ProductDAO = require('../daos/ProductDAO.js');
var OrderDAO = require('../daos/OrderDAO.js');
var CategoryDAO = require('../daos/CategoryDAO.js');
// routes
router.get('/', function (req, res) {
  res.redirect('/home');
});

router.get('/home', async function (req, res) {
  res.render('customer/home.ejs');
});

router.get('/aboutus', async function (req, res) {
  res.render('customer/aboutus.ejs');
});
router.get('/contactus', async function (req, res) {
  res.render('customer/contactus.ejs');
});

router.get('/shop', async function (req, res) {
  res.render('customer/shop.ejs');
});

router.get('/shopping', async function (req, res) {
  // var products = await ProductDAO.getAll();
  // res.render('customer/shopping.ejs', { products: products });
  var categories = await CategoryDAO.selectAll();
  categories.unshift({ _id: 0, name: 'All' });
  var products = [];
  if (req.query.catname && req.query.catname !== 'All') {
    products = await ProductDAO.selectByCategory(req.query.catname);
  } else {
    products = await ProductDAO.getAll();
  }
  var nCols = 3;
  var nRows = Math.ceil(products.length / nCols);
  res.render('../views/customer/shopping.ejs', { catSelected: req.query.catname, cats: categories, products: products, nCols: nCols, nRows: nRows });
});

router.get('/viewproduct/:id', async function (req, res) {
  var id = req.params.id;
  var product = await ProductDAO.getDetails(id);
  res.render('customer/viewproduct.ejs', { product: product });
});
router.post('/add2cart', async function (req, res) {
  var id = req.body.txtID;
  var product = await ProductDAO.getDetails(id);
  var quantity = parseInt(req.body.txtQuantity);
  // create empty mycart
  var mycart = [];
  // get mycart from session if exist
  if (req.session.mycart) {
    mycart = req.session.mycart;
  }
  // check exist product from mycart
  var index = mycart.findIndex(x => x.product._id == id);
  if (index == -1) {
    var newItem = { product: product, quantity: quantity };
    mycart.push(newItem);
  } else {
    mycart[index].quantity += quantity;
  }
  // put mycart back into the session
  req.session.mycart = mycart;
  // for DEBUG
  /*console.log('-------------');
  for (var item of req.session.mycart) {
    console.log(item.product.name + " | " + item.quantity);
  }*/
  res.redirect('/shopping');
});
router.get('/mycart', function (req, res) {
  if (req.session.mycart && req.session.mycart.length > 0) {
    res.render('customer/mycart.ejs');
  } else {
    res.redirect('/shopping');
  }
});
router.get('/remove2cart/:id', function (req, res) {
  var id = req.params.id;
  if (req.session.mycart) {
    var mycart = req.session.mycart;
    var index = mycart.findIndex(x => x.product._id == id);
    if (index != -1) { // found, remove item
      mycart.splice(index, 1);
      req.session.mycart = mycart;
    }
  }
  res.redirect('/mycart');
});
router.get('/checkout', function (req, res) {
  if (req.session.mycart && req.session.mycart.length > 0) {
    res.render('customer/checkout.ejs');
  } else {
    res.redirect('/shopping');
  }
});
router.post('/checkout', async function (req, res) {
  var custName = req.body.txtCustName;
  var custPhone = req.body.txtCustPhone;
  var custAddress = req.body.txtCustAddress;
  var now = new Date().getTime(); // milliseconds
  var total = 0;
  for (var item of req.session.mycart) {
    total += item.product.price * item.quantity;
  }
  var order = {
    custName: custName, custPhone: custPhone, custAddress: custAddress, datetime: now,
    items: req.session.mycart, total: total, status: 'PENDING'
  };
  var result = await OrderDAO.insert(order);
  if (result) {
    delete req.session.mycart;
    res.redirect('/shopping');
  } else {
    res.redirect('/mycart');
  }
});
module.exports = router;