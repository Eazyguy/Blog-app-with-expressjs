const express = require('express')
const router = express.Router()
const {check,validationResult} = require('express-validator')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const ensureGuest = require('../config/ensureGuest')
const ensureAuthenticated = require('../config/ensureAuthenticated')

let User = require('../models/user')
let Settings = require('../models/settings')


//login
router.get('/login',ensureGuest,(req,res)=>{
     // fetch category from settings
     Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
    res.render('login',{
        title:'Login',
        category:setting.category
    })
    })
})
    
router.post('/login',(req,res,next)=>{
        passport.authenticate('local',{
            successRedirect:req.session.redirectTo||'/admin/dashboard',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next)
    })
    
    //register user
    router.get('/users',ensureAuthenticated,(req,res)=>{
        User.find({}).then((user)=>{
         // fetch category from settings
         Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
            if(req.user.role == 'Admin'){
                res.render('register',{
                    user:user,
                    title:'Users',
                    category:setting.category
                })
            
            }else{
                res.redirect('/admin/dashboard')
                req.flash('danger','Access Denied')
            }
        })
        })
    })
    
    var validation=[
        check('name','Name is required').notEmpty(),
        check('username','Username is required').notEmpty(),
        check('username').custom(async(username,{req})=>{
            let query = await User.findOne({username:username})
            if(query){
                throw new Error('Username already exist')
            }
        }),
        check('email','Email is required').notEmpty(),
        check('email').custom(async(email,{req})=>{
            let query = await User.findOne({email:email})
            if(query){
                throw new Error('Email already exist')
            }
        }),
        check('email','Email must be valid').isEmail(),
        check('phone','Phone Number is required').notEmpty(),
        check('phone').custom(async(phone,{req})=>{
            let query = await User.findOne({phone:phone})
            if(query){
                throw new Error('Phone number already exist')
            }
        }),
        check('password','Password is required').notEmpty(),
        check('password2').custom(async(password2,{req})=>{
            if(password2 !== req.body.password){
                throw new Error('Passwords do not match')
            }
        })
    ]
    
    router.post('/register',validation,(req,res)=>{
        const name = req.body.name
        const username = req.body.username
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
    
        let errors = validationResult(req)
    
        if(!errors.isEmpty()){
            res.render('register',{
                errors:errors.array()
            })
        }else{
            let newUser = new User({
                name:name,
                username:username,
                email:email,
                phone:phone,
                password:password
            })
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err)console.log(err)
                newUser.password=hash
                newUser.save().then(()=>{
                    req.flash('success',"successfully Registered Please Login")
                    res.redirect('/login')
                }).catch(err=>console.log(err))
            })
        })
    
    }
    
        
    })
    
    router.get('/logout',(req,res)=>{
        req.logout((err)=>{
            if(err) return next(err)
            req.flash('success','You have successfully Logged Out')
            res.redirect('/')
        })
    })

    //Delete User

    router.delete('/users/delete/:user',(req,res)=>{
        User.deleteOne(req.params).then(()=>{
            res.send('success')
        }).catch((err)=>{
            if(err)console.log(err)
        })
    })

    module.exports = router