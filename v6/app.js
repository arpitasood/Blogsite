var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment     = require("./models/comment");
var User=require("./models/user");
var seedDB      = require("./seeds");


seedDB();
mongoose.connect("mongodb://localhost/yelpcamp3", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));	

// passport configration
app.use(require("express-session")({
    secret:"Once again wins cutest dogs",
    resave:false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});

app.get("/",function(req,res){
    res.render("landing");
});

// INDEX-show all campgrounds
app.get("/campgrounds",function(req,res){
    // all campground  from db
    Campground.find({}, function(err,allcampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
});
   

// create-add  new campground to db
app.post("/campgrounds",function(req,res){
    //   get data from form and add to campgrounds array
var name= req.body.name;
 var image= req.body.image;
 var newCampground={name:name,image:image};
//  create new campground and save to db
Campground.create(newCampground,function(err,newlyCreated){
    if(err){
        console.log(err);
    }else{
        // redirect to campgrounds page
        res.redirect("campgrounds");
    }
});
});


// NEW-show form to create new campground
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new.ejs");
});

// SHOW- shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       }else{
           console.log(foundCampground);
        //   render show template with that  campground
          res.render("campgrounds/show",{campground:foundCampground});
       }
   });
});



// =============
// COMMENT ROUTES
// =============

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new",{campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments",isLoggedIn, function(req, res) {
    // lookup campground using id
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});
// =================
// AUTH Routes
// =================

// show register form
app.get("/register", function(req,res){
    res.render("register");
});

// handle dign up logic
app.post("/register",function(req,res){
var newUser = new User({username:req.body.username});
User.register(newUser,req.body.password,function(err,user){
    if(err){
        console.log(err);
        return res.render("register");
    }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/campgrounds");
    });
  });
});

// show login form
app.get("/login",function(req, res) {
    res.render("login");
});


// handling login route
app.post("/login", passport.authenticate("local",
  {
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), function(req,res){
});

// logic route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    }

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp has started");
});
