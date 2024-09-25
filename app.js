const express = require('express');
const app = express();
const path = require('path')
const usermodel = require('./model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.render("index");
})


app.post('/create',(req,res)=>{
    let {username, age,password,email} = req.body;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt, async (err,hash)=>{
            let createduser = await usermodel.create({
                username,
                email,
                password:hash,
                age
            })
            res.redirect('/');
        })
    })
    let token = jwt.sign({email},'shhhhhhhhhhhh');
    res.cookie("token",token);
})

app.get('/login',(req,res)=>{
    res.render("login");
})


app.post('/login',async (req,res)=>{
    let user = await usermodel.findOne({email: req.body.email});
    if(!user) res.send("Something Went Wrong");

    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result) res.render("account_page",{user});
        else res.send("something Went Wrong");
    })
})

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/')
})


app.listen(3000);

