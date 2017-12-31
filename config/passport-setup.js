const passport = require('passport');
const GoogleStrategy= require('passport-google-oauth20').Strategy;
const keys=require('./keys');
const User = require('../models/user-model');
const FacebookStrategy  = require('passport-facebook').Strategy;
passport.use(
    new FacebookStrategy({
        clientID:'152343332075297',
        clientSecret:'ffe320d3c876db6db26737097591bc08',
        callbackURL:'http://localhost:3000/auth/facebook/redirect'
    },(accessToken,refreshToken,profile,done)=>{
        console.log('in facebook login callback');
        return done(null,profile);
    })
)


passport.use(
    new GoogleStrategy({
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret,
        callbackURL:'/auth/google/redirect',
    },(accessToken,refreshToken,profile,done)=>{
        //passport callback fn
        // console.log(profile);
        // console.log(User);
        console.log('in passport callback');

        //check if user exists in db
        User.findOne({googleID:profile.id}).then((currentUser)=>{
            if(currentUser){
                //alreadyd have a user
                console.log('user is :',JSON.stringify(currentUser));
                done(null,currentUser)
            }
            else{
                new User({
                    username:profile.displayName,
                    googleID:profile.id,
                    thumbnail:profile._json.image.url
                }).save().then((newUser)=>{
                    console.log('in save');
                    console.log('new user created:'+newUser);
                    done(null,newUser);
                })
            }
        })

    }
));



passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user);
    })

})
