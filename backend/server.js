const express = require("express");
const cors= require("cors");
const {connectDB}=require('./db');
const app = express();
const authroutes=require('./routes/authroutes');
const codingroutes=require('./routes/codingroutes');
const userRoutes=require('./routes/userroutes');
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db=require('./db');
const { connect } = require("mongoose");
app.use('/auth', authroutes);
app.use("/coding",codingroutes);
app.use("/user",userRoutes);
app.listen(5000, (req,res)=>{
    console.log('Server is running on port 5000')
});
