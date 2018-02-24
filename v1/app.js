var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose")

mongoose.connect("mongodb://Localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

// schema setup
var campgroundSchema= new mongoose.Schema({
    name:String,
    image:String
});

var Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//     {
//         name:"ghelan", image:"https://farm5.staticflickr.com/4247/35141807772_d96355cb4b.jpg"
//     },function(err,campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("newly created campground");
//             console.log(campground);
//         }
//         });

 

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
 var newCampground={name:name,image:image}
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