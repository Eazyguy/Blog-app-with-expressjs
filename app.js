var express = require("express")
var path = require("path")
var pug = require("pug")
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const config = require('./config/database')
const passport = require('passport')
const logger = require('morgan')
const methodOverride = require('method-override')
const  expressSitemapXml = require('express-sitemap-xml')
const getUrlsFromDatabase = require('./Seo/sitemap')
const robots = require('express-robots-txt')

const mongoose = require('mongoose')

    mongoose.connect(config.database)
    let db = mongoose.connection

    db.once('open',()=>{
        console.log('database connected')
    })

    db.on('error',(err)=>{
        console.log(err)
    })

// init app
var app = express()

//set Template Engine
app.set('views',path.join(__dirname,"views"))
app.set("view engine","pug")

// set public folder
app.use(express.static(path.join(__dirname,"public")))

// body-parser middleware
    app.use(bodyParser.urlencoded({extended:false}))
    app.use(bodyParser.json())

    // method override
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
          // look in urlencoded POST bodies and delete it
          var method = req.body._method
          delete req.body._method
          return method
        }
      }))

// express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))

  //express messages middleware
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// express flash miidleware
app.use(flash())

//logger middleware
app.use(logger('dev'))

//tinymce route
app.use(express.static(path.join(__dirname,'node_modules','tinymce')))

//moment.js
app.use(express.static(path.join(__dirname,'node_modules','moment')))

//passport config
require('./config/passport')(passport)

//passport middleware

app.use(passport.initialize())
app.use(passport.session())

// sitemap 
app.use(expressSitemapXml(getUrls,'http://localhost:3000'))

// Robots.txt
app.use(robots(__dirname + '/Seo/robots.txt'))

// Bring in model

let Article = require('./models/article')
let User = require('./models/user')
let Settings = require('./models/settings')


// Access Control Middleware
app.get('*',(req,res,next)=>{
    res.locals.user = req.user || null
    next()
})

async function getUrls(){
    return await getUrlsFromDatabase()
}

//user route
let user = require('./routes/user');
app.use('/',user)

// index route
let index = require('./routes/index');
app.use('/',index)

// post route
let articles = require('./routes/posts');
app.use('/posts',articles)

//post page route
let page = require('./routes/pages');
app.use('/page/',page)

//Admin Page route
let admin = require('./routes/Admin');
app.use('/admin/',admin)

// Profile Route
let profile = require('./routes/profile');
app.use('/profile/',profile)

//featured Post
let featuredPost = require('./routes/featuredPost');
app.use('/admin/dashboard/',featuredPost)

// category
let category = require('./routes/category');
app.use('/category/',category)

// tags
let tags = require('./routes/tags');
app.use('/tags/',tags)

//settings
let settings = require('./routes/settings');
app.use('/admin/dashboard/',settings)

// search 
let search = require('./routes/search');
app.use('/',search)

//404 page
let err404 = require('./routes/error/404');
app.use('/',err404)

app.all('*',(req,res)=>{
     // fetch category from settings
     Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
    res.status(404).render('error/404',{
        category:setting.category
    })
     })
})


app.listen('3000',(err)=>{
    if(err)console.log(err)
    console.log('connected on port 3000')
})