
let Article = require('../models/article')
let User = require('../models/user')
let Settings = require('../models/settings')

module.exports= async function getUrlsFromDatabase(){
  const post = await Article.find({}).select({'title':1,'category':1}).lean()
  const user = await User.find({}).select({'tags':1})
  const category = await Settings.findOne({_id:'656f89ecca90516a2249ad0a'}).select({category:1,_id:0})

  const title = post.map((item)=>'/'+item.title)
  const tags = user.map((item)=>item.tags)
  const categories = category.category.map((item)=>'/category/'+item)

    
    let newTags = tags.flat()
  
    let mergedTags = [...new Set(newTags)]

    let  finTag = mergedTags.map((item)=>'/tags/'+item)
    
    let urls = ['/']
    return urls.concat(categories).concat(finTag).concat(title)
}