const express = require('express')
const app = express()
const port = 3000
const path = require('path')
// const postModel = require('./models/posts')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { render, redirect } = require('ejs')
const { log } = require('console')
const { mongo } = require('mongoose')
const freeModel = require('./models/freeModel')
const clientModel = require('./models/clientModel')
const projectModel = require('./models/projectModel')
const requestModel = require('./models/RequestModel')

// const multerconfig=require('./config/multerconfig')
app.use(express.static(path.join(__dirname, 'public')))

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.render('landing')
})


app.get('/free', async (req, res) => {
  let { email, password } = req.body;

  res.render('freeLogin')
})

app.post('/freelancer/login', async (req, res) => {
  let { email, password } = req.body;
  let user = await freeModel.findOne({ email })
  if (!user) return res.render('Error', { client: false })

  //to check if paswword is same or not
  let result = await bcrypt.compare(password, user.password)
  //initailizing tokens
  let token = jwt.sign({ email, userid: user._id,name:user.name }, "secret")
  res.cookie("token", token);

  if (result) {
    res.render('freeDashboard', { user })
  }
  else {
    return res.render('Error', { client: false })
  }


})



app.get('/free/register', async (req, res) => {
  res.render('freeReg')
})


app.post('/free/register/save', async (req, res) => {

  let { name, email, phone, skills, exp, qual, desc, password } = req.body;

  // Split the skills string into an array
  let sepskills = skills.split(',').map(skill => skill.trim());  // Ensures extra spaces are trimmed
  // Generate a salt for bcrypt hashing
  bcrypt.genSalt(10, (err, salt) => {
    // Hash the password
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await freeModel.create({
        name,
        email,
        phone,
        skills: sepskills,
        exp,
        qual,
        desc,
        password: hash
      });

      // Redirect on successful registration
      res.redirect('/free');
    });
  });

});



app.get('/freeDashboard', isLoggedIn, async (req, res) => {
  let user = await freeModel.findOne({ _id: req.user.userid })
  res.render('freeDashboard', { user })
})
app.get('/project', isLoggedIn, (req, res) => {
  res.render('projectDesc')
})

// comleted projects route
app.get('/freePC', isLoggedIn, (req, res) => {
  res.render('freePC')
})

// Wallet route
app.get('/freeWallet', isLoggedIn, (req, res) => {
  res.render('freeWallet')
})

//all projects jobs available for freelancer
app.get('/freeJobs', isLoggedIn, async (req, res) => {
  let projects=await projectModel.find().populate('client')
  res.render('freeJobs',{projects})
})

app.get('/allJobsProjectDetails', isLoggedIn, (req, res) => {
  res.render('allJobsProjectDetails')
})

app.get('/freins', isLoggedIn, (req, res) => {
  res.render('freeIns')
})


app.get('/allJobsProjectDetails/:id', isLoggedIn,async (req, res) => {
  let project=await projectModel.findOne({_id:req.params.id}).populate('client')

  res.render('allJobsProjectDetails',{project})
})


app.get('/freeProfile', isLoggedIn, (req, res) => {
  res.render('freeProfile')
})
app.get('/freeNotification', isLoggedIn, (req, res) => {
  res.render('freeNotification')
})
app.get('/client/freelancer/:id', isLoggedIn, async (req, res) => {
  let user = await freeModel.findOne({ _id: req.params.id })
  res.render('freeProfile',{user})
})


app.post('/sendrequest/:pid/:cid', isLoggedIn,async (req, res) => {
  let pid=req.params.pid;
  let cid=req.params.cid;
  let comp=req.body.comp;
   let request= await requestModel.create({
    project:pid,
    client:cid,
    freelancer:req.user.userid,
    comp
   })

   res.redirect('/freeJobs')


})



//logout
app.get('/free/logout', (req, res) => {
  res.cookie('token', "")
  res.redirect('/')
})


app.get('/clientLogin', (req, res) => {
  res.render('client/Login')
})

app.post('/clientLogin', async (req, res) => {
  let { email, password } = req.body;
  let user = await clientModel.findOne({ email }).populate("projects")
  if (!user) return res.render('Error', { client: true })

  //to check if paswword is same or not
  let result = await bcrypt.compare(password, user.password)
  //initailizing tokens
  let token = jwt.sign({ email, userid: user._id,name:user.name }, "secret")
  res.cookie("token", token);

  if (result) {
    res.render('client/Dashboard', { user })
  }
  else {
    return res.render('Error', { client: true })
  }

})

app.get('/client/register', (req, res) => {
  res.render('client/Register')
})
app.post('/client/register/save', (req, res) => {
  let { name, cname, email, phone, desc, website, password } = req.body;
  // Ensures extra spaces are trimmed
  // Generate a salt for bcrypt hashing


  bcrypt.genSalt(10, (err, salt) => {
    // Hash the password
    bcrypt.hash(password, salt, async (err, hash) => {

      let user = await clientModel.create({
        name,
        cname,
        email,
        phone,
        desc,
        website,
        password: hash
      });

      // Redirect on successful registration
      res.redirect('/clientLogin');
    });
  });
})
app.get('/client/dashboard', isLoggedIn, async (req, res) => {
  let user = await clientModel.findOne({ _id: req.user.userid }).populate("projects")
 
  res.render('client/Dashboard', { user })
})


app.get('/client/clientprofile', isLoggedIn, async (req, res) => {
  let user = await clientModel.findOne({ _id: req.user.userid })
  res.render('client/clientProfile', { user })
})
app.get('/client/createProject', isLoggedIn, async (req, res) => {
  res.render('client/createProject')
})



//creating a new project
app.post('/project/create', isLoggedIn, async (req, res) => {
  let user = await clientModel.findOne({ _id: req.user.userid });
  let { title, desc, skills, budget, deadline, category } = req.body;
  
  const dateObj = new Date(deadline);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const day = dateObj.getDate().toString().padStart(2, '0');
  const dateOnly = `${day}-${month}-${year}`;


  let project = await projectModel.create({
    title,
    desc,
    skills,
    client:req.user.userid,
    budget,
    deadline: dateOnly,
    category
  })
  user.projects.push(project._id)
  await user.save();
  console.log(user);

  res.redirect('/client/dashboard')
})

app.get('/project/:id', isLoggedIn, async (req, res) => {
  let project = await projectModel.findOne({_id: req.params.id});

  
  
  res.render('client/projectDesc',{project,name:req.user.name})

})
app.get('/delete/:id', isLoggedIn, async (req, res) => {
  let project = await projectModel.findOneAndDelete({_id: req.params.id});  
  res.redirect('/client/Dashboard')

})





app.get('/client/requests', isLoggedIn, async (req, res) => {
  
  const requests = await requestModel.find({ client: req.user.userid })
  .populate('project freelancer')  // Populate project and freelancer details if needed
  console.log(requests);
  
  res.render('client/Requests', { requests });
})
app.get('/client/freelancer', isLoggedIn, async (req, res) => {
  res.render('client/freeProfile')
})
app.get('/client/projectCompleted', isLoggedIn, async (req, res) => {
  res.render('client/projectCompleted')
})
app.get('/client/rate', isLoggedIn, (req, res) => {
  res.render('client/rate')
})

function isLoggedIn(req, res, next) {
  if (req.cookies.token === "") return res.send("you must be logged In ")
  else {
    let data = jwt.verify(req.cookies.token, "secret")
    req.user = data;


    next();

  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})