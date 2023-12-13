const express = require('express')
const router = express.Router()

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')

//pagination
router.get('/:page', (req,res,next)=>{
    var perPage = 8
    var page = req.params.page || 1

    Article.find({})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    .exec().then((articles)=>{
        Article.countDocuments().then((count)=>{
            const author = articles.map((item)=>item.author)
            User.find({'_id._id':{$in:author}}).then((users)=>{
             // fetch category from settings
             Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
            res.render('index',{
                articles:articles,
                current:page,
                pages:Math.ceil(count/perPage),
                users:users,
                title:'page'+page,
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