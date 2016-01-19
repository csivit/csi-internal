var express = require('express');
var router = express.Router();
var needle = require('needle');
var async = require("async");
var slots = require("../util/slots");
var User = require("../schemas/user");
var passport=require("passport");

var obj1 = require("../util/initslots");
var clubs=require("../schemas/club");
/* GET home page. */

if (!Array.prototype.remove) {
  Array.prototype.remove = function(vals, all) {
    var i, removedItems = [];
    if (!Array.isArray(vals)) vals = [vals];
    for (var j = 0; j < vals.length; j++) {
      if (all) {
        for (i = this.length; i--;) {
          if (this[i] === vals[j]) removedItems.push(this.splice(i, 1));
        }
      }
      else {
        i = this.indexOf(vals[j]);
        if (i > -1) removedItems.push(this.splice(i, 1));
      }
    }
    return removedItems;
  };
}

var isAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

var isNotAuthenticated = function(req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated() == false)
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/home');
};

module.exports = function(passport) {

  router.post('/register-vit', isAuthenticated, function(req, res, next) {

    req.session.info = req.body;

    needle.post('https://vitacademics-rel.herokuapp.com/api/v2/vellore/login', req.session.info, function(error, response) {
      if (!error && response.statusCode == 200) {
        console.log(response.body);
        if (response.body.status.code == 0)
          res.redirect('/details');
        else if (response.body.status.code == 12) {
          console.log('Invaild Credentials');
          req.flash('message','Invaild Credentials');
          res.redirect('/register-vit');
        }
      }
    });

  });

  router.get('/create',function(req,res,next){
    res.render("club-details");
  });

  router.post('/create',function(req, res, next) {
      clubs.findOne({name:req.body.clubname},function(err,club){
         if(err)
         return err;
        if(club)
          console.log("Club/chapter already exists!");
       else
       {
         var newclub=new clubs({
         name:req.body.clubname,
         description_club:req.body.descrpt,
         events:req.body.event,
         admin:req.body.admin,
         adminregno:req.body.regno,
         adminuser:req.body.username_admin,
         adminpass:req.body.username_pass,
         members_core:req.body.core,
         members_board:req.body.board
       });
       
        newclub.save(function(err) {
            if (err) throw err;
            console.log("Club/chapter created!");
        });
      }
       
    clubs.findOne({name:req.body.clubname},function(err,cl){
      if(err) throw err;
      console.log(cl);
});
    res.redirect("/dashboard");
  });
  });
  
  router.get('/admin',function(req, res, next) {
     res.render("admin"); 
  });

  /*router.post('/admin',function(req, res, next) {
        User.findOne({reg_no:req.body.regno},function(err,users){
         if(err)
         return err;
       if(users)
       {
         var newadmin=new Admin({
         admin:req.body.admin,
         adminregno:req.body.regno,
         adminuser:req.body.username_admin,
         adminpass:req.body.username_pass
       });
          newadmin.save(function(err) {
            if (err) throw err;
            console.log("Admin created!");
           
        });

       }
       else
       {
         console.log("Admin not registered!");
      }
       
    Admin.findOne({admin:req.body.admin},function(err,cl){
      if(err) throw err;
      console.log(cl);
});
      res.redirect('/create');
  });
  });*/

  router.get('/login', function(req, res, next) {
    res.render('userlogin',{message : req.flash('message')});  
  });
  
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));
  
  router.get('/dashboard',isAuthenticated, function(req, res, next) {
      User.findOne({reg_no : req.session.regno}, function(err, cl) {
        if (err) {
            res.send(err);
          }
        res.render('dashboard', {data : cl}); 
      });
  });

 

  router.get('/register', function(req, res, next) {
    res.render('register',{message : req.flash('message')});
  });

  router.post('/register', passport.authenticate('signup', {
    successRedirect: '/register-vit',
    failureRedirect: '/register',
    failureFlash: true
  }));

  router.get('/register-vit', function(req, res, next) {
    res.render("register-vit", {mes : req.flash('message')});
    
  });


 
router.post('/edit',function(req,res,next){
  User.findOne({reg_no:req.reg_no},function(err,users_edit){
    if (err)
      return err;
    var update=users_edit({
      name:req.body.name,
      email:req.body.email,
      phone_no:req.body.mobile
  });
  update.save(function(err) {
            if (err) throw err;
            console.log("User details updated!");
        });
})});

  router.get('/users', function(req, res, next) {
    User.find({},'reg_no name',function(err, users){
      if (err) {
              res.send(err);
            }
      res.render('users',{data : users});
    });
  })

router.get('/edit',isAuthenticated, function(req, res, next) {
      User.findOne({reg_no : req.session.info.regno}, function(err,c2) {
        if (err) {
            res.send(err);
          }
        res.render('editdetails', {data : c2}); 
      });
  });


  router.get('/details', function(req, res, next) {
    

    needle.post('https://vitacademics-rel.herokuapp.com/api/v2/vellore/refresh', req.session.info, function(error, response) {
      if (!error && response.statusCode == 200) {
        
      var init = JSON.parse(JSON.stringify(obj1));
        
        async.each(response.body.courses, function(item, callback) {
            if (item.slot != null) {
              var sp = item.slot.split("+");
              if (sp[0].substring(0, 1) == "L") {
                for(var i =0; i < sp.length; i++)
                  init.remove(parseInt(sp[i].substring(1, 3)));
              }
              else {
                init.remove(slots[sp[0]]);
                if (sp[1] != undefined) {
                  init.remove(slots[sp[1]]);
                }
              }

            }
             callback();
          },
          function(err) {
            if (err) {
              res.send(err);
            }
            User.findById(req.user._id, function(err, user) {
              if (err) {
                res.send(err);
              }
              user.free_slots = init;
              user.save();
            });
            res.send("OK");
          });
      }
    });
  });


  router.post("/api", function(req, res, next) {
    console.log(req.body);
    res.send("OK");
  });

  return router;
};