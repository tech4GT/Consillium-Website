var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('home');
});
  
  function ensureAuthenticated(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/auth/login');
  }

// // Home Page
// router.get('/', function(req, res, next) {
//     res.render('home',{user:req.user});
// });

module.exports = router;