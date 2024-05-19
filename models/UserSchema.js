const mongoose =require("mongoose");

const UserSchema=mongoose.Schema({
        uid:String,
        name:String,
        email:String,
        pic:String,
});

const User=mongoose.model('Users',UserSchema);

module.exports=User;