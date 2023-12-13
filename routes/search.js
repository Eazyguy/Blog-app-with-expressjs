const express = require('express')
const router = express.Router()
const moment = require('moment')

let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')

// Get Search result

router.post('/search/',(req,res)=>{
    var perPage = 8
    var page = req.params.page || 1
    let query=req.body.search

    Article.find({$text:{$search:query}},{score:{$meta:"textScore"}})
    .sort({score:{$meta:"textScore"}})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .then((result)=>{
        const author = result.map((item)=>item.author)
    Article.countDocuments({$text:{$search:query}}).then(count=>{
    User.find({'_id._id':{$in:author}}).then((users)=>{
        Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('category',{
            articles:result,
            users:users,
            query:query,
            pages:Math.ceil(count/perPage),
            current:page,
            date:moment(result.createdAt).format('Do MMMM YYYY'),
            title:'Search results for \"'+req.body.search+'\"' || req.body.search,
            category:setting.category,
            page:'search'
        })
    })
    })
    }).catch(()=>{
        res.render('error/404')
    })
        
    })
})

// search home

router.get('/search/:title',(req,res)=>{
    var perPage = 8
    var page = req.params.page || 1
    let query=req.params.title
    let regex = /\"[a-z]+\"/gi
    let result = query.match(regex)
    const fin = result.join('').slice(1,-1)

    Article.find({$text:{$search:fin}},{score:{$meta:"textScore"}})
    .sort({score:{$meta:"textScore"}})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .then((result)=>{
        const author = result.map((item)=>item.author)
    Article.countDocuments({$text:{$search:fin}}).then(count=>{
        console.log(count)
    User.find({'_id._id':{$in:author}}).then((users)=>{
        Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('category',{
            articles:result,
            users:users,
            query:query,
            pages:Math.ceil(count/perPage),
            current:page,
            date:moment(result.createdAt).format('Do MMMM YYYY'),
            title:req.params.title,
            category:setting.category,
            page:'search'
        })
    })
    })
    }).catch((err)=>{
        if(err)console.log(err)
        res.render('error/404')
    })
        
    })
})

// Search result pagination

router.get('/search/:title/page-:page',(req,res)=>{
    var perPage = 8
    var page = req.params.page || 1
    let query=req.params.title
    let regex = /\"[a-z]+\"/gi
    let result = query.match(regex)
    const fin = result.join('').slice(1,-1)

    Article.find({$text:{$search:fin}},{score:{$meta:"textScore"}})
    .sort({score:{$meta:"textScore"}})
    .skip((perPage * page)-perPage)
    .limit(perPage)
    .then((result)=>{
        console.log(result.length)
        const author = result.map((item)=>item.author)
    Article.countDocuments({$text:{$search:fin}}).then(count=>{
        console.log(count)
    User.find({'_id._id':{$in:author}}).then((users)=>{
        Settings.findOne({'_id._id':'656f89ecca90516a2249ad0a'}).then((setting)=>{
        res.render('category',{
            articles:result,
            users:users,
            query:query,
            pages:Math.ceil(count/perPage),
            current:page,
            date:moment(result.createdAt).format('Do MMMM YYYY'),
            title:req.params.title,
            category:setting.category,
            page:'search'
        })
    })
    })
    }).catch((err)=>{
        if(err)console.log(err)
        res.render('error/404')
    })
        
    })
})

module.exports = router