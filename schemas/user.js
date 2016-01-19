var mongoose = require("mongoose");


module.exports = mongoose.model("User", {
    email : String,
    password : String,
    phone_no : String,
    free_slots : [Number],
    reg_no : String,
    clubs : {type:[String], default:[]},
    name : String
});
