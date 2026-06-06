if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");

const dbUrl = process.env.ATLASDB_URL;
// const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//sesseion 
const sessionOptions = {
    secret : process.env.SECRET_key,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    } ,
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success =  req.flash("success");
    res.locals.error =  req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/demouser",async (req,res)=>{
    let fakeuser = new User({
        email:"anshu@gmail.com",
        username : "siddhart verma"
    });

    let registeruser = await User.register(fakeuser,"anshusharma");
    res.send(registeruser);
});


app.get("/search",async (req,res)=>{
    let {q} = req.query;
    let listing = await Listing.find({country : q });
    res.send(listing);

});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//standard error response
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

//error handler middleware
app.use((err,req,res,next)=>{
    let { status = 500 , message = "something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
});

app.listen(8080,() =>{
    console.log("app listen start....");
});
