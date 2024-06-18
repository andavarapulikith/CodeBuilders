const express = require("express");
const cors= require("cors");
const bodyParser = require("body-parser");
const app = express();
const authroutes=require('./routes/authroutes');
const codingroutes=require('./routes/codingroutes');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const db=require('./db');
app.use('/auth', authroutes);
app.use("/coding",codingroutes)
app.listen(5000, (req,res)=>{
    console.log('Server is running on port 5000')
});
