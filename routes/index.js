var express = require('express');
var router = express.Router();

// Home Page
router.get('/', function(req, res, next) {
    res.render('home',{user:req.user});
});

module.exports = router;