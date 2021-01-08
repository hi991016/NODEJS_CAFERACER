var express = require('express');
var app = express();
app.listen(process.env.PORT || 1016);

// middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var session = require('express-session');
app.use(session({ secret: "hi@101699" }));
// this middleware makes templates accessible session variables
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
// template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// routes
app.use('/', require('./routes/customer.js'));
app.use('/admin', require('./routes/admin.js'));

app.use(express.static('public'));

