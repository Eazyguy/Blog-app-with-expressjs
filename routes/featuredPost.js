const express = require('express')
const router = express.Router()
const ensureAuthenticated = require('../config/ensureAuthenticated')

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')
const settings = require('../models/settings')

// featured Post

router.get('/featured-posts',ensureAuthenticated, (req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({featuredPost:'on'})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({featuredPost:'on'}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'featured-posts',
                title:'Featured Post Setting',
                category:setting.category
            })
        })
    })
})
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

// my post that area featured post

router.get('/my-featured-posts',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({author:req.user._id.toString(),featuredPost:'on'})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({author:req.user._id.toString(),featuredPost:'on'}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'my-featured-posts',
                title:'My featured Posts',
                category:setting.category
            })
        })
    })
    })
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

// add posts from all posts to featured post

router.get('/add-featured-posts',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]}).then(count=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('add_featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'add-featured-posts',
                title:'Add Featured Posts',
                category:setting.category
            })
        })
    })
    })
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

// add my Post to featured Post
router.get('/add-featured-posts/mine',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({author:req.user._id.toString(),'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('add_featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'add-featured-posts/mine',
                title:'Add my posts to featured Posts',
                category:setting.category
            })
        })
    })
    })
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

//featured Post Pagination

router.get('/featured-posts/page-:page',ensureAuthenticated, (req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({featuredPost:'on'})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({featuredPost:'on'}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'featured-posts',
                title:'featured Post setting - page'+page,
                category:setting.category
            })
        })
    })
    })
    }).catch(()=>{
        res.render('error/404')
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

// my featured post pagination

router.get('/my-featured-posts/page-:page',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({author:req.user._id.toString(),featuredPost:'on'})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({author:req.user._id.toString(),featuredPost:'on'}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'my-featured-posts',
                title:'My featured post-page'+page,
                category:setting.category
            })
        })
    })
    })
    }).catch(()=>{
        res.render('error/404')
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

// add posts from all posts to featured post pagination

router.get('/add-featured-posts/page-:page',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('add_featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'add-featured-posts',
                title:'Add featured Posts-page'+page,
                category:setting.category
            })
        })
        })
    })
    }).catch(()=>{
        res.render('error/404')
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})

//add my posts to featured post pagiation

router.get('/add-featured-posts/mine/page-:page',ensureAuthenticated,(req,res)=>{
    var perPage = 10
    var page = req.params.page || 1
    if(req.user.role == 'Admin'){
        Article.find({author:req.user._id.toString(),'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({date:-1})
    .exec().then((articles)=>{
        Article.countDocuments({author:req.user._id.toString(),'featured.fieldname':'file',$or:[{featuredPost:{$exists:false}},{featuredPost:''}]}).then((count)=>{
            User.find({'_id':articles.author}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('add_featured_post',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                url:'add-featured-posts/mine',
                title:"Add my posts to featured post-page"+page,
                category:setting.category
            })
        })
    })
    })
    })

    }else{
        res.redirect('/admin/dashboard')
        req.flash('danger', 'Access Denied')
    }
})


module.exports = router