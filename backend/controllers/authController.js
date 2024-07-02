const bcrypt = require('bcryptjs');
const User=require('../models/user_model');
const Admin=require("../models/admin_model")
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

// check user login
const login_post = (req, res) => {
    const { email, password } = req.body;
    const findUser = (model) => {
        return model.findOne({ email });
    };
    findUser(User).then((user) => {
        if (user) {
            bcrypt.compare(password, user.password).then((match) => {
                if (match) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            _id: user._id,
                            role: 'user' 
                        },
                        process.env.secretkey,
                        {
                            expiresIn: "24h"
                        }
                    );
                    res.status(200).json({ success: true, message: "User login successful", user, token,role:"user"});
                } else {
                    res.status(401).json({ success: false, message: "Invalid credentials" });
                }
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Error comparing passwords" });
            });
        } else {
          
            findUser(Admin).then((admin) => {
                if (admin) {
                    
                    if(password===admin.password) {
                        
                          
                            const token = jwt.sign(
                                {
                                    email: admin.email,
                                    _id: admin._id,
                                    role: 'admin' 
                                },
                                process.env.secretkey,
                                {
                                    expiresIn: "24h"
                                }
                            );
                            res.status(200).json({ success: true, message: "Admin login successful", user:admin, token,role:"admin"});
                        }
                         else {
                            res.status(401).json({ success: false, message: "Invalid credentials" });
                        
                    }
                } else {
                    res.status(404).json({ message: "User or admin not found" });
                }
            }).catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Error finding admin" });
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error finding user" });
    });
};


// register user
const signup_post=(req,res)=>{
    const {username, email, password,contact}=req.body;
    const hashedpassword=bcrypt.hashSync(password, 10);
    
    const user=new User({username, email, password:hashedpassword, contact_number:contact});
    user.save({username, email, password:hashedpassword, contact_number:contact}).then((result)=>{
        console.log(result);
        res.json({message:"User registered successfully"});
    }).catch((err)=>{
        console.log(err);
        res.json({message:"Error in registering user"});    
    }
    )
}
const profile_get=(req,res)=>{
    const id=req.params.id;
    
    User.findById(id).then((user)=>{
        console.log(user)
        res.json({user});
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({message:"Error finding user"});
    })
}

module.exports={login_post,signup_post,profile_get}
