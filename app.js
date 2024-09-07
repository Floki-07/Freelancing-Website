const express = require('express')
const app = express()
const port = 3000
const path=require('path')
// const userModel = require('./models/users')
// const postModel = require('./models/posts')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { render } = require('ejs')
// const multerconfig=require('./config/multerconfig')
app.use(express.static(path.join(__dirname, 'public')))

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req, res) => {
  res.render('landing')
})
app.get('/free', (req, res) => {
  res.render('freeLogin')
})
app.get('/free/register/', (req, res) => {
  res.render('freeReg2')
})
app.get('/freeDashboard', (req, res) => {
  res.render('freeDashboard')
})
app.get('/project', (req, res) => {
  res.render('projectDesc')
})

// comleted projects route
app.get('/freePC', (req, res) => {
  res.render('freePC')
})

// Wallet route
app.get('/freeWallet', (req, res) => {
  res.render('freeWallet')
})

//all projects jobs available for freelancer
app.get('/freeJobs', (req, res) => {
  res.render('freeJobs')
})
app.get('/allJobsProjectDetails', (req, res) => {
  res.render('allJobsProjectDetails')
})
app.get('/freeProfile', (req, res) => {
  res.render('freeProfile')
})
app.get('/free/logout', (req, res) => {
  res.redirect('/')
})








app.get('/clientLogin', (req, res) => {
  res.render('client/Login')
})
app.get('/client/register', (req, res) => {
  res.render('client/Register')
})
app.get('/client/dashboard', (req, res) => {
  res.render('client/Dashboard')
})
app.get('/client/clientprofile', (req, res) => {
  res.render('client/clientProfile')
})
app.get('/client/createProject', (req, res) => {
  res.render('client/createProject')
})
app.get('/client/requests', (req, res) => {
  res.render('client/Requests')
})
app.get('/client/freelancer', (req, res) => {
  res.render('client/freeProfile')
})
app.get('/client/projectCompleted', (req, res) => {
  res.render('client/projectCompleted')
})
app.get('/client/rate', (req, res) => {
  res.render('client/rate')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})