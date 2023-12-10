const express = require('express')
const router = express.Router()
const moment = require('moment')

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')


router.get('/:category',(req,res)=>{
    var perPage = 8
    var page = req.params.page || 1
        
    Article.find(req.params)
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
        Article.find(req.params).countDocuments().exec().then((count)=>{
            const author = articles.map((item)=>item.author)
            User.find({'_id':{$in:author}}).then((users)=>{
                Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('category',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:req.params.category,
                date:moment(articles.createdAt).format('Do MMMM YYYY'),
                page:'category',
                category:setting.category
            })
        })
    })
    })
    }).catch(()=>{
        res.render('error/404')
    })
})

// category pagination

router.get('/:category/page-:page',(req,res)=>{
    var perPage = 8
    var page = req.params.page || 1
    Article.find({category:req.params.category})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
        Article.find({category:req.params.category}).countDocuments().exec().then((count)=>{
            const author = articles.map((item)=>item.author)
            User.find({'_id':{$in:author}}).then((users)=>{
                Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('category',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                date:moment(articles.createdAt).format('MMMM Do YYYY'),
                title:req.params.category,
                page:'category',
                category:setting.category
            })
        })
        })
    })
    }).catch(()=>{
        res.render('error/404')
    })
})

module.exports = router