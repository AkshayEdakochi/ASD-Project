const express = require('express');
const router = express.Router();
const bcrypt =require('bcryptjs');
const passport=require('passport');
let Article = require('../models/article');

//Bring in User models
let User = require('../models/user');
const {check,validationResult}=require('express-validator/check');


//Register from

router.get('/register',function(req,res){
  res.render('register');

});

// register process
router.post('/register',[
  check('name',).not().isEmpty().withMessage('Name is required'),
  check('email','Email is required').not().isEmpty(),
  check('email','Email is not valid').isEmail(),
  check('username','Username is required').not().isEmpty(),
  check('password','Password is required').not().isEmpty(),
   check('password2','Passwords do not match').custom((value,{req})=> (req.body.password))
], function(req,res){

  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  //Get validationErrors
  let errors = req.validationErrors();

  if(errors){
res.render('register',{
  errors:errors
});

  } else{
    let newUser= new User({
      name:name,
      email:email,
      username:username,
      password:password

    });

    bcrypt.genSalt(10, function(err,salt){
      bcrypt.hash(newUser.password,salt,function(err,hash){
        if(err){
          console.log(err);
        }
        newUser.password=hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success','You have registered and can log in');
            res.redirect('/users/login');

          }
        });
      });
    });

  }

});

//LOgin form
router.get('/login', function(req,res){
  res.render('login');
});

//Login process
router.post('/login', function(req,res,next){
  passport.authenticate('local',{
    successRedirect:'/users/loggedin',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);
});

//Logged in page
router.get('/loggedin', function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('loggedin', {
        title:'Event List',
        articles: articles
      });
    }
  });
});



//logout
router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','You are logged out');
  res.redirect('/users/login');
});

module.exports= router;
