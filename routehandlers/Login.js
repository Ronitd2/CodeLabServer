const User = require("../models/UserSchema");
const express= require('express');
const router = express.Router();

router.post('/',async (req,res)=>{
    try{
        if(!req.body.uid ){
            return res.json({error: 'invalid credentials'});
        }
        console.log(req.body);
        const user = await User.findOne({uid:req.body.uid});
        if(user == [] || !user){
            return res.json({error: 'invalid credentials'});
        }
        console.log(user);
        // const token = await jwt.sign({ data:{email: req.body.email}}, SECRET);
       
        res.json({success: 'OK' ,tokenname:user.name})
    }
    catch(err){
        return res.json({error: 'invalid credentials'});
    }
})

module.exports = router