const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../config/ensureAuthenticated')
const upload = require('../config/multer')

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    User.findOne({'_id':req.user._id.toString()}).then((userss)=>{
         // fetch category from settings
         Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('dashboard',{
            userss:userss,
          //  title:userss.role+' '+'Dashboard',
            category:setting.category
        })
    })
    }).catch(()=>{
        res.render('error/400')
    })
    
})

// Post list in dashboard

router.get('/dashboard/my-posts',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    Article.find({author:req.user._id.toString()})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
         // fetch category from settings
         Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        Article.countDocuments({author:req.user._id.toString()}).then((count)=>{
            User.find({}).then((users)=>{
            res.render('post_list',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:'My Posts',
                url:'my-posts',
                name:users.name,
                category:setting.category
            })
        })
    })
    })
})
})

// all Post
router.get('/dashboard/all-posts', ensureAuthenticated,async (req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
if(req.user.role == 'Admin'){

    Article.find({})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then(async (articles)=>{
         Article.countDocuments().then((count)=>{
         const author = articles.map((item)=>item.author)
            User.find({'_id._id':{$in:author}}).then((users)=>{
                 // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('post_list',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:'All Posts',
                url:'all-posts',
                category:setting.category
            })
    })
    })
})
    })
}else{
    res.redirect('/admin/dashboard/my-posts')
    req.flash('danger','Access Denied')
}
})

// Update Profile

router.post('/dashboard/update-profile',ensureAuthenticated,upload,(req,res)=>{
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

    User.updateOne({'_id':req.user._id.toString()},user).then(()=>{
        res.redirect('/admin/dashboard')
        req.flash('success','Profile Successfully Updated')
    }).catch((err)=>{if(err)console.log(err)})
    
})

router.get('/dashboard/update-profile',ensureAuthenticated,(req,res)=>{
    User.findOne({'_id':req.user._id.toString()}).then((user)=>{
     // fetch category from settings
     Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('update_profile',{
            user:user,
            title:'Profile update',
            category:setting.category
        })
    })
    })
   
})


// all post pagination

router.get('/dashboard/all-posts/page-:page',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
if(req.user.role == 'Admin'){

    Article.find({})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
         // fetch category from settings
         Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        Article.countDocuments().then((count)=>{
            const author = articles.map((item)=>item.author)
            User.find({'_id':{$in:author}}).then((users)=>{
            res.render('post_list',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:'All post',
                url:'all-posts',
                category:setting.category
            })
        })
    })
    })
    })
}else{
    req.flash('danger','Access Denied')
   return res.redirect('/admin/dashboard/my-posts')
    
}
})

// my Post pagination

router.get('/dashboard/my-posts/page-:page',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    Article.find({author:req.user._id.toString()})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
         // fetch category from settings
        Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        Article.countDocuments({author:req.user._id.toString()}).then((count)=>{
            User.find({'_id':req.user._id.toString()}).then((users)=>{
            res.render('post_list',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:'My Posts',
                url:'my-posts',
                category:setting.category
            })
        })
    })
})
    })
})


module.exports = router