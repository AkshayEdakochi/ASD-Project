const express = require('express');
const router = express.Router();

//Bring in Article models
let Article = require('../models/article');
const {check,validationResult}=require('express-validator/check');




//Add route
router.get('/add',function(req,res){

  res.render('add_article',{
    title:'Add Events'
  });
});



//Add submit post route
router.post('/add',[
  check('title',).not().isEmpty().withMessage('Event name is required'),
  check('author','College name is required').not().isEmpty(),
  check('body','Event description is required').not().isEmpty(),
], function(req,res){

  //Get Error
  let errors= req.validationErrors();

  if(errors){
    res.render('add_article',{
      title:'Add Events',
      errors:errors
    });

  } else{
    let article =new Article();
    article.title =req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });

  }

});

//Load Edit form
router.get('/edit/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

//Update submit post route
router.post('/edit/:id',function(req,res){
  let article ={};
  article.title =req.body.title;
  article.author=req.body.author;
  article.body=req.body.body;

  let query ={_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      req.flash('success','Article Updated')
      res.redirect('/');
    }
  });
});

//Delete Article
router.delete('/:id', function(req,res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//Get Single article
router.get('/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render('article',{
      article:article
    });
  });
});
//aa

module.exports= router;
