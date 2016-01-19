var LocalStrategy  = require('passport-local').Strategy;
var User = require('../schemas/user');
var Club = require('../schemas/club');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){
    

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) {
            User.findOne({ 'reg_no' :  username },
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));
                    }
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    req.session.regno = user.reg_no;
                    return done(null, user);
                }
            );

        })
    );


    passport.use('signup', new LocalStrategy({
              passReqToCallback : true // allows us to pass back the entire request to the callback
          },
          function(req, username, password, done) {

              var findOrCreateUser = function(){
                  User.findOne({ 'reg_no' :  username }, function(err, user) {
                      if (err){
                          console.log('Error in SignUp: '+err);
                          return done(err);
                      }
                      if (user) {
                          console.log('User already exists with username: '+username);
                          return done(null, false, req.flash('message','User Already Exists'));
                      } else {
                          
                          var newUser = new User();

                          // set the user's local credentials
                          newUser.reg_no = username;
                          newUser.password = createHash(password);
                          newUser.email = req.param('email');
                          newUser.phone_no = req.param('mobile');
                          newUser.name = req.param('name');
                          // save the user
                          newUser.save(function(err) {
                              if (err){
                                  console.log('Error in Saving user: '+err);
                                  throw err;
                              }
                              console.log('User Registration succesful');
                              return done(null, newUser);
                          });
                      }
                  });
              };
              // Delay the execution of findOrCreateUser and execute the method
              // in the next tick of the event loop
              process.nextTick(findOrCreateUser);
          })
      );

      // Generates hash using bCrypt
      var createHash = function(password){
          return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
      }


    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    }

};