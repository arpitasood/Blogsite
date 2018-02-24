var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var seedDB      = require("./seeds");

seedDB();
mongoose.connect("mongodb://localhost/yelpcamp3", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


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
            res.render("index",{campgrounds:allcampgrounds});
        }
    });
});
   

// create-add  new campground to db
app.post("/campgrounds",function(req,res){
    //   get data from form and add to campgrounds array
var name= req.body.name;
 var image= req.body.image;
 var newCampground={name:name,image:image}
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
    res.render("new.ejs");
});

// SHOW- shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       }else{
        //   render show template with that  campground
        console.log("Found campground:",foundCampground);
          res.render("show",{campground:foundCampground});
       }
   });
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("yelpcamp has started");
});