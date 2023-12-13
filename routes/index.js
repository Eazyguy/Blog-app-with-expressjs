const express = require('express')
const router = express.Router()
const moment = require('moment')

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')


// get posts to homepage

router.get('/',(req,res)=>{
    var perPage = 8
    var page = req.params.page || 1



    Article.find({})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
        Article.countDocuments().then((count)=>{
            const author = articles.map((item)=>item.author)
            // featured post slide
            Article.find({featuredPost:'on'}).limit(5).sort({createdAt:-1}).then((featured)=>{
            // featured category slide
            Article.find({'featured.fieldname':'file',category:'sports'})
            .limit(7)
            .sort({createdAt:-1})
            .then((featuredCat1)=>{
               // featured Category slide 2
                Article.find({'featured.fieldname':'file',category:'entertainment'})
                .limit(5)
                .sort({createdAt:-1})
                .then((featuredCat2)=>{
                     // featured Category slide 3
                Article.find({'featured.fieldname':'file',category:'news'})
                .limit(5)
                .sort({createdAt:-1})
                .then((featuredCat3)=>{
                     // featured Category slide 4
                Article.find({'featured.fieldname':'file',category:'bussiness'})
                .limit(5)
                .sort({createdAt:-1})
                .then((featuredCat4)=>{
            // find authors of each article
            User.find({'_id._id':{$in:author}}).then((users)=>{
            // fetch category from settings
            Settings.findOne({"_id._id":"656f89ecca90516a2249ad0a"}).then((setting)=>{
            res.render('index',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                featured:featured,
                featuredCat1:featuredCat1,
                featuredCat2:featuredCat2,
                featuredCat3:featuredCat3,
                featuredCat4:featuredCat4,
                category:setting.category,
                title:'Home of latest Updates'
            })
        })
    })
})
})
        })
    })
})
        })
    })/*.catch(()=>{
        res.render('error/404')
    })*/
}) 

// view Post

router.get('/:title',(req,res)=>{
    // Related Posts
    Article.findOne(req.params).then((posts)=>{
        Article.find({$or:[{'category':{$in:posts.category}},{'tags':{$in:posts.tags}}]})
        .limit(6)
        .exec()
        .then((related)=>{
            Article.find().limit(6).then(recent=>{
            User.findOne({'_id._id':posts.author}).then((puser)=>{
                 // fetch category from settings
            Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
                res.render('posts',{
                    posts:posts,
                    author:puser.name,
                    date:moment(posts.date).format('MMMM Do YYYY, h:mm:ss a'),
                    edited:moment(posts.date).format('MMMM Do YYYY, h:mm:ss a'),
                    related:related.slice(0,-1),
                    bio:puser.bio,
                    profileImg:puser.profile,
                    puser:puser,
                    recent:recent,
                    title:req.params.title.length > 50?req.params.title.substring(0,50)+'...':req.params.title,
                    category:setting.category
                })
            })
            })
        })
            })
        }).catch(()=>{
            res.render("error/404")
        })
})

module.exports = router