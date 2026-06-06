const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res)=>{
    try{
        let {username , email , password } = req.body;
        let newUser = new User({username ,email});
        let registeruser = await User.register(newUser , password);
        console.log(registeruser);
        //if you sign then you automatci login
        req.login(registeruser , (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust , Here you can start");
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res)=>{
    req.flash("success","welcome to your account");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!!")
        res.redirect("/listings");
    });
};