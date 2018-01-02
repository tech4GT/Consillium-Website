var express = require('express');

const passportSetup = require('./config/passport-setup')
const mongoose = require('mongoose');
const keys=require('./config/keys');
const cookieSession = require('cookie-session');
const passport=require('passport');

const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

var app =express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.session.cookieKey]
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(keys.mongodb.dbURI,()=>{
    console.log('connected to mongodb');
});

// Static Folder
app.use(express.static(path.join(__dirname, '/public')));

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.authdata = fbRef.getAuth();
  res.locals.page = req.url;
  next();
});

// Route files
const routes = require('./routes/index');
const authRoutes=require('./routes/auth');
const profileRoutes = require('./routes/profile-routes');

app.use('/',routes);
app.use('/auth',authRoutes);
app.use('/profile',profileRoutes);

// Set Port
app.set('port', (process.env.PORT || 3000));

// Run Server
app.listen(app.get('port'), function(){
  console.log('Server started on port: '+app.get('port'));
});