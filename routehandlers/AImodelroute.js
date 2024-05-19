const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
// const API_KEY=process.env.API_KEY;
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
router.post('/',async(req,res)=>{
        console.log(req.body);
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      
        const prompt = req.body.prompt;
      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        
        const value=prompt+"\n"+text;
        const sentences = value.split(/\n{1,2}/);
        const filteredSentences = sentences.filter(sentence => sentence.trim() !== '');
        console.log(filteredSentences);

        res.json({response:filteredSentences});
    });
    module.exports = router;