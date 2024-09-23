const express = require("express");
const app = express();
const mongoose = require("mongoose");
const signmodel = require("./models/signin")
const feedback = require("./models/feedback")
const Semester = require("./models/semester");
const Subject = require("./models/subject");
const Note = require("./models/note");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

const MONGO_URL = "mongodb://127.0.0.1:27017/learning-website";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(methodOverride("_method"));

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));

app.use(cookieParser());

app.get("/home", async(req,res) =>{
    const semesters = await Semester.find();
    res.render('home.ejs', { semesters });
})

  //New Route
  app.get("/home/index", (req, res) => {
    res.render("index.ejs");
  });
  
// feedback route
app.post("/home", async (req, res) => {
    const allfeedback = new feedback(req.body);
    console.log(allfeedback);
    await allfeedback.save();
    res.redirect("/home");
  });
  
  //Edit Route
  app.get("/home/:id/edit", async (req, res) => {
    let { id } = req.params;
    const syllabus = await Subject.findById(id);
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
    let deletedListing = await Subject.findByIdAndDelete(id);
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

// Route to handle semester form submission
app.post('/add-semester', async (req, res) => {
  const { name } = req.body;
  const newSemester = new Semester({ name });
  await newSemester.save();
  res.redirect('/');
});
  
  //View subjects for a specific semester
  app.get('/semester/:id', async (req, res) => {
    const semester = await Semester.findById(req.params.id).populate('subjects');
    res.render('semester.ejs', { semester });
  });


  // Route to handle adding a subject to a semester
app.post('/semester/:id/add-subject', async (req, res) => {
  const { name } = req.body;
  const semester = await Semester.findById(req.params.id);

  const newSubject = new Subject({ name, semesterId: semester._id });
  await newSubject.save();

  semester.subjects.push(newSubject);
  await semester.save();

  res.redirect(`/semester/${semester._id}`);
});
  
  
  // View notes for a specific subject
  app.get('/subject/:id', async (req, res) => {
    const subject = await Subject.findById(req.params.id).populate('notes').populate('semesterId');
    res.render('subject', { subject });
  });
  

  app.get('/subject/:id/add', async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    res.render('add', { subject });
  });
  
  // Route to add a note to a specific subject
  app.post('/subject/:id/add-note', async (req, res) => {
    const { heading, subheading, content, image } = req.body;
    const subject = await Subject.findById(req.params.id);
  
    const newNote = new Note({
      heading,
      subheading,
      content,
      image,
      subjectId: subject._id,
    });
  
    await newNote.save();
    subject.notes.push(newNote);
    await subject.save();
  
    res.redirect(`/subject/${subject._id}`);
  });
  // Handle 404 errors
  app.use((req, res) => {
    res.status(404).send('Page not found');
  });
  
  

app.listen(3000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 3000);
})