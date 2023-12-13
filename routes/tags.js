const express = require('express')
const router = express.Router()
const moment = require('moment')

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')


router.get('/:tags',(req,res)=>{
    var perPage = 9
    var page = req.params.page || 1
    
    Article.find(req.params)
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .exec().then((articles)=>{
        Article.find(req.params).countDocuments(req.params).exec().then((count)=>{
            const author = articles.map((item)=>item.author)
            User.find({'_id._id':{$in:author}}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('category',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:req.params.tags,
                page:'tags',
                date:moment(articles.createdAt).format('Do MMMM YYYY'),
                category:setting.category
            })
        })
    })
    })
}).catch(()=>{
    res.render('error/404')
})
})

//tags pagiantion
router.get('/:tags/page-:page',(req,res)=>{
    var perPage = 9
    var page = req.params.page || 1
    Article.find({tags:req.params.tags})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .exec().then((articles)=>{
        Article.countDocuments({tags:req.params.tags}).then((count)=>{
            const author = articles.map((item)=>item.author)
            User.find({'_id._id':{$in:author}}).then((users)=>{
            // fetch category from settings
            Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('category',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                page:'tags',
                title:req.params.tags,
                category:setting.category
            })
        })
        })
    })
})
})

module.exports = router