const express = require("express");
const cors= require("cors");
const {connectDB}=require('./db');
const app = express();
const authroutes=require('./routes/authroutes');
const codingroutes=require('./routes/codingroutes');
const userRoutes=require('./routes/userroutes');
const adminRoutes=require('./routes/adminroutes');
const Admin=require("./models/admin_model")

connectDB();
const allowedOrigins = ['https://code-builders.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin:allowedOrigins ,
  methods: ['GET', 'POST', 'PUT','HEAD', 'DELETE'],
  credentials: true 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db=require('./db');
const { connect } = require("mongoose");
app.use('/auth', authroutes);
app.use("/coding",codingroutes);
app.use("/user",userRoutes);
app.use("/admin",adminRoutes);

app.listen(5000, (req,res)=>{
    console.log('Server is running on port 5000')
});
