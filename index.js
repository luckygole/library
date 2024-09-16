const express = require("express");
const app = express();
const signmodel = require("./models/signin")
const Syllabus = require("./models/syllabus")
const feedback = require("./models/feedback")
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(cookieParser());

app.get("/home", async(req,res) =>{
    const alldata = await Syllabus.find({});
    console.log(alldata);
    res.render("home.ejs" , {alldata})
})

  //New Route
  app.get("/home/new", (req, res) => {
    res.render("new.ejs");
  });
  
  //Show Route
  app.get("/home/:id", async (req, res) => {
    let { id } = req.params;
    const syllabus = await Syllabus.findById(id);
    res.render("show.ejs", { syllabus });
  });
  
// feedback route
app.post("/home", async (req, res) => {
    const allfeedback = new feedback(req.body);
    console.log(allfeedback);
    await allfeedback.save();
    res.redirect("/home");
  });
  

  //Create Route
  app.post("/home", async (req, res) => {
    const newsyllabus = new Syllabus(req.body);
    console.log(newsyllabus);
    await newsyllabus.save();
    res.redirect("/home");
  });
  
  //Edit Route
  app.get("/home/:id/edit", async (req, res) => {
    let { id } = req.params;
    const syllabus = await Syllabus.findById(id);
    res.render("edit.ejs", { syllabus });
  });
  
  //Update Route
  app.put("/home/:id", async (req, res) => {
    let { id } = req.params;
    await Syllabus.findByIdAndUpdate(id, { ...req.body.syllabu });
    res.redirect(`/home/${id}`);
  });
  
  //Delete Route
  app.delete("/home/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Syllabus.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/home");
  });
  

app.get("/home" , (req,resp) => {
    resp.render("home.ejs")
})


//sign in page
app.get("/signin" , (req,resp) => {
    resp.render("signin");
})

//about page 
app.get("/about",(req,res)=>{
    res.render("about.ejs")
})
//post the data in signin page
app.post("/register" , async (req,resp) => {
    try{
        let {fullname , email , password} = req.body;

        let user = await signmodel.findOne({email});
        if(user) return resp.send("user already registered");

        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(password, salt , async(err,hash) => {
                let user = await signmodel.create({
                    fullname,
                    email,
                    password:hash
                });

                let token = jwt.sign({email:email},"hpaash");
                resp.cookie("token",token);
                resp.redirect("login")
            })
        })
    }
    catch(err){ 
        console.log(err)
    }
})

//login page
app.get("/login" , (req,resp) => {
    resp.render("login");
})

app.post("/login" , async (req,resp) => {
    try{
        let { email , password} = req.body;

        let user = await signmodel.findOne({email});
        if(!user) return resp.send("something went wrong");

        bcrypt.compare(password, user.password,function(err, result){
            if(result){
                let token = jwt.sign({email:email},"hpaash");
                resp.cookie("token",token);
                resp.redirect("/home")
            }
            else{
                resp.redirect("/login")
            }
        })
    }
    catch(err){ 
        console.log(err)
    }
})

app.listen(3000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3000);
})