var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");



mongoose.connect("mongodb://localhost/yelpcamp", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgroundSchema= new mongoose.Schema({
    name:String,
    image:String
});

var Campground = mongoose.model("Campground", campgroundSchema);



// Campground.create(
//     {        name:"monica",
//     image:"https://farm5.staticflickr.com/4148/5060196028_b57026a2e0.jpg",
//     description:"it is a beautiful hill, no water. no bathrooms. Fantastic monica"

//     }, function(err, campground){
//         if(err){
//             console.log("error");
//         }else{console.log("newly created campground");
//         console.log(campground);
//         }
//     });


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
   Campground.findById(req.params.id, function(err,foundCampground){
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