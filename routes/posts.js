const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const {check,validationResult} = require('express-validator')
const ensureAuthenticated = require('../config/ensureAuthenticated')
const upload = require('../config/multer')
const moment = require('moment')
const fs = require('fs')


let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')



router.get('/add',ensureAuthenticated,(req,res)=>{
     // fetch category from settings
     Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
    res.render('add_article',{
        title:'Add Post',
        category:setting.category
    })
})
})

// add post

// init post validation

var validation=[
    check('title','Title is required').notEmpty(),
    check('body','Body is required').notEmpty()
]

router.post('/add',ensureAuthenticated,upload,validation,(req,res)=>{
 const article = new Article()
 const date = new Date()

 article.title =req.body.title
 article.author=req.user._id.toString()
 article.body =req.body.body.trim()
 article.featured = req.file
 article.featuredPost= req.body.featuredPost
 article.category = req.body.category.split(',')
 article.tags = req.body.tags
 article.created = moment(date).format('MMMM Do YYYY, h:mm:ss a')

 let errors = validationResult(req)

 if(!errors.isEmpty()){
    Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
    res.render('add_article',{
        errors:errors.array(),
        category:setting.category
    })
})
}else{
    article.save().then(()=>{
        
        User.findOne({'_id':req.user._id.toString()}).then((user)=>{
            if (article.tags){
            const filTags = article.tags.filter((item)=>!user.tags.includes(item))
            const newTags = user.tags.concat(filTags)
            User.updateOne(user,{tags:newTags}).then(()=>{
                res.redirect('/admin/dashboard/my-posts')
            })
            }
            
            
 })  
}).catch((err)=>{
    if(err)console.log(err)
})
}

})

// Edit post

router.get('/:title/edit',ensureAuthenticated,(req,res)=>{
    Article.findOne(req.params).then((post)=>{
         // fetch category from settings
         Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('edit_post',{
            post:post,
            title:'Edit-'+req.params.title,
            category:setting.category
        })
    })
})
})

//update post

router.post('/:title/edit',ensureAuthenticated,upload,(req,res)=>{
    let article = {}
    let date = new Date()

    article.title =req.body.title
    article.body =req.body.body
    article.featured = req.file
    article.featuredPost= req.body.featuredPost
    article.category = req.body.category.split(',')
    article.tags = req.body.tags
    article.edited= date
     

    let errors = validationResult(req)

    if(!errors.isEmpty()){
        // fetch category from settings
        Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
       res.render('edit_Post',{
           errors:errors.array(),
           category:setting.category
       })
    })
    }else{
    Article.findOne(req.params).then((post)=>{
    Article.updateOne(req.params,article).then(()=>{
        User.findOne({'_id':req.user._id.toString()}).then((user)=>{
            const filTags = post.tags.filter((item)=>!user.tags.includes(item))
            const newTags = user.tags.concat(filTags)
            User.updateOne(user,{tags:newTags}).then(()=>{
                res.redirect('/'+post.title)
            })
        })
    }).catch(err=>{
        if(err)console.log(err)
    })
})
    }
})

// Delete Post

router.delete('/:title',async(req,res)=>{
    if(!req.user._id.toString()){
        res.status(500).send();
    }

Article.findOne(req.params).then((posts)=>{
    if(posts.author !== req.user._id && req.user.role !== 'Admin'){
        res.status(500).send()
    }else{
            if(posts.featured){
                fs.unlink(posts.featured.destination+posts.featured.filename,(err)=>{
                   if(err) throw err
               })
           }
           Article.deleteOne(req.params).then(()=>{
               res.redirect('/admin/dashboard/my-posts' )
           }).catch((err)=>{
               if(err)console.log(err)
           })

    }
})
})

// remove Featured Post

router.post('/featured/:title/remove',(req,res)=>{
    let article = {}

    Article.findOne(req.params).then(()=>{
    article.featuredPost = '' 

    Article.updateOne(req.params,article).then(()=>{
        res.send('success')
    })

    })
    })

    // add featured Post

    router.post('/featured/:title/add',(req,res)=>{
        let article = {}

        Article.findOne(req.params).then(()=>{
            article.featuredPost = 'on'

            Article.updateOne(req.params,article).then(()=>{
                res.send('success')
            })
        })
    })

module.exports = router