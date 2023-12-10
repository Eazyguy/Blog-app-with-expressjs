const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../config/ensureAuthenticated')
const upload = require('../config/multer')

let User = require('../models/user')
let Settings = require('../models/settings')

router.get('/:id/edit',ensureAuthenticated,(req,res)=>{
    User.findOne({_id:req.params.id}).then((user)=>{
        Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('edit_profile',{
            user:user,
            title:'Edit '+user.name+' profile',
            category:setting.category
        })
    })
    }).catch((err)=>{
        if(err)console.log(err)
    })
})

router.post('/:id/edit',ensureAuthenticated,upload,(req,res)=>{
    let user = {}
    user.name = req.body.name
    user.username = req.body.username
    user.email = req.body.email
    user.role = req.body.role
    user.phone = req.body.phone
    user.facebook = req.body.facebook
    user.twitter = req.body.twitter
    user.github = req.body.github
    user.linkedin = req.body.linkedin
    user.instagram = req.body.instagram
    user.bio = req.body.bio
    user.profile = req.file
    
    if(req.user.role == 'Admin'){
        User.updateOne({_id:req.params.id},user).then(()=>{
            res.redirect('/admin/dashboard')
            req.flash('success','Profile Successfully Updated')
        }).catch((err)=>{if(err)console.log(err)})
    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger','Acess Denied')
    }
    
})

router.get('/:id',ensureAuthenticated,(req,res)=>{
    User.findOne({_id:req.params.id}).then((ruser)=>{
        if(req.user._id == ruser._id || req.user.role == 'Admin'){
            Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('profile',{
            ruser:ruser,
            title:ruser.name,
            category:setting.category
        })
    })
    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Acess Denied')
    }
    }).catch(()=>{
        res.render('error/404')
    })
})

module.exports = router