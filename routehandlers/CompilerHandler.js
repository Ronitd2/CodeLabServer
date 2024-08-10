const express= require('express');
const router = express.Router();
const {python} = require('compile-run');
router.post('/',async (req,res)=>{
    
    try{
    const sourcecode = `print("Hell0 W0rld!")`;
    let resultPromise = await python.runSource(sourcecode);
    // resultPromise
    //     .then(result => {
    //         console.log(result);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    console.log(resultPromise);
    res.json({success: 'OK' ,output:resultPromise})    
    }catch(err)
    {
        console.log(err);
    }
})

module.exports = router