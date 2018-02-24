var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),

mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


 

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
//   get all campgrounds from db
Campground.find({},function(err,allCampgrounds){
    if(err){
        console.log(err);
    }else {
             res.render("campgrounds",{campgrounds:allCampgrounds});
    }
  });
});


app.post("/campgrounds",function(req,res){
    //   get data from form and add to campgrounds array
var name= req.body.name;
 var image= req.body.image;
 var newCampground={name:name,image:image};
 campgrounds.push(newCampground);
// redirect to campgrounds page
res.redirect("campgrounds");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelpcamp has started");
});