const express= require('express');
const router = express.Router();
const {c, cpp, node, python, java} = require('compile-run');
router.post('/',async (req,res)=>{
    
    try{
    console.log(req.body);
    const source = `print("Hell0 W0rld!")`;
    let resultPromise="";
    if(req.body.program==="C++")
    {
        console.log("Inside C++");
         resultPromise = await cpp.runSource({ stdin:req.body.input},req.body.sourcecode);    

    }
    else if(req.body.program==="C")
    {
         resultPromise = await c.runSource(req.body.sourcecode);    

    }
    else if(req.body.program==="Java")
    {
         resultPromise = await java.runSource(req.body.sourcecode);    
    }
    else if(req.body.program==="Python")
    {
         resultPromise = await python.runSource(req.body.sourcecode);      
    }
    else if(req.body.program==="Javascript")
    {
         resultPromise = await node.runSource(req.body.sourcecode);    
  
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