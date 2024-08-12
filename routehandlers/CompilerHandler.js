const express= require('express');
const router = express.Router();
const {c, cpp, node, python, java} = require('compile-run');
router.post('/',async (req,res)=>{
    
    try{
    console.log(req.body);
    const source = `print("Hell0 W0rld!")`;

    if(req.body.program==="C++")
    {
        const resultPromise = await cpp.runSource(req.body.sourcecode);    

    }
    else if(req.body.program==="C")
    {
        const resultPromise = await c.runSource(req.body.sourcecode);    

    }
    else if(req.body.program==="Java")
    {
        const resultPromise = await java.runSource(req.body.sourcecode);    
    }
    else if(req.body.program==="Python")
    {
        const resultPromise = await python.runSource(req.body.sourcecode);      
    }
    else if(req.body.program==="Javascript")
    {
        const resultPromise = await node.runSource(req.body.sourcecode);    
  
    }
    //let resultPromise = await python.runSource(req.body.sourcecode);
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