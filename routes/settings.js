const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const ensureAuthenticated = require('../config/ensureAuthenticated')
const fs = require('fs/promises')

let User = require('../models/user')
let Settings = require('../models/settings')

// Settings Page
router.get('/settings',ensureAuthenticated,async(req,res)=>{
    const category = await Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).lean()
    const user = await User.findOne({'_id._id':req.user._id})
    // read robot.txt file 
    const robo = await fs.readFile('./Seo/robots.txt',{encoding:'utf8'})
    let cat = category.category.toString()
    let cati = cat.split(',')
    res.render('settings',{
        title:'Settings',
        category:cati || category.category,
        tags:user.tags,
        robo:robo
    })
})


// Change Password

router.put('/settings',ensureAuthenticated,(req,res)=>{
    let password = req.body.password
    let password2 = req.body.password2
User.findOne({'_id._id':req.user._id.toString()}).then((user)=>{
    bcrypt.compare(password,user.password,(err,isMatch)=>{
        if(err)console.error(err)

        if(password !== password2 ){
            req.flash('danger','passwords do not match')
            return res.redirect('/admin/dashboard/settings')
    
        }else if(!password||!password2){
            req.flash('danger','fields cannot be empty')
            return res.redirect('/admin/dashboard/settings')
    
        }else if(isMatch){
            req.flash('danger','password in use, please input another password')
            return res.redirect('/admin/dashboard/settings')
        }else{
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(password,salt,(err,hash)=>{
                    if(err)console.err(err)
                    password=hash
                    User.updateOne({'_id._id':req.user._id.toString()},{password:password}).then(()=>{
                        req.logout((err)=>{
                            if(err) return next(err)
                            req.flash('success','You have successfully changed your password, please login again')
                            res.redirect('/login')
                    })
                })
            })
        })
        }
    })
})
    })

    // Add or Remove categories 

router.put('/settings-category',ensureAuthenticated,async(req,res)=>{
  try {
    let query = req.body.category.split(',')
        if(query==''){
            req.flash('danger','You need at least one category')
            return res.redirect('/admin/dashboard/settings')
        }else{
            await Settings.updateOne({'_id._id':'656f89ecca90516a2249ad0a'},{category:query})
            req.flash('success', 'Category sucessfully updated')
            return res.redirect('/admin/dashboard/settings')
        }
    } catch (err) {
        if(err)console.log(err)
        req.flash('danger','An error occurred or you need at least two categories')
        return res.redirect('/admin/dashboard/settings')
    }
    
})

// Add or Remove Tag Suggestions

router.put('/settings-tag',ensureAuthenticated,async(req,res)=>{
   try {
      let query = req.body.tags.split(',')
         if(query==''){
              req.flash('danger','You need at least one category')
              return res.redirect('/admin/dashboard/settings')
          }else{
              await User.updateOne({'_id._id':req.user._id.toString()},{tags:query})
              req.flash('success', 'Category sucessfully updated')
              return res.redirect('/admin/dashboard/settings')
          }
      } catch (err) {
          if(err)console.log(err)
          req.flash('danger','An error occurred or you need at least two categories')
          return res.redirect('/admin/dashboard/settings')
      }
      
  })

  // rewrite robot.txt file

  router.put('/settings/robot',ensureAuthenticated,async(req,res)=>{
    const data = req.body.robo
    await fs.writeFile('./Seo/robots.txt',data)
    req.flash('success','you have successfully updated your robots.txt')
    return res.redirect('/admin/dashboard/settings')
  })

module.exports = router