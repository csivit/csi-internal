var express = require('express');
var router = express.Router();

var User = require("../schemas/user");
var Club = require("../schemas/club");

module.exports = function(passport) {

  router.get('/free', function(req, res, next) {
     User.find({free_slots : parseInt(req.query.time)},'reg_no name',function(err, names){
       if (err) {
              res.send(err);
            }
            
       res.json(names);
     }); 
  });
  
  router.get('/', function(req, res, next) {
     User.find({},'reg_no name', function (err, club) {
        if (err) {
              res.send(err);
            }
        const members = club;
        
        res.render('announcements',{data : members});
     });
  });
  
  router.post('/',function(req, res, next) {
     console.log(req.body);
     res.send("OK"); 
  });
  return router;
}