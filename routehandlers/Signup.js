const User = require("../models/UserSchema");
const express= require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    if(!req.body.email || !req.body.name || !req.body.uid ){
        console.log('Missing property')
        return res.json({error: 'invalid credentials'});
    }
    try {
        console.log(req.body);
        const checkUser = await User.findOne({email:req.body.email});
        if(checkUser){
            console.log("Enter",checkUser)
            return res.json({error: 'user with this email already exists'});
        }
        else{
        const user = new User(req.body);
        await user.save();
        console.log("Successfull complete");
        res.json({ success: 'OK',tokenname:req.body.name});
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports=router;