var mongoose = require("mongoose");
var schema=mongoose.Schema;

var clubschema=new schema({
    name : String,
    admin : String,
    adminregno:String,
    adminuser:String,
    adminpass:String,
    description_club : String,
    admin : String,
    events : {type:Array, default:[]},
    members_core : {type:[String], default:[]},
    members_board : {type:[String], default:[]},
});

// var ObjectId = mongoose.Schema.Types.ObjectId;

module.exports = mongoose.model("Club",clubschema);
