const mongoose = require('mongoose')

let articleSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:false
    },
    body:{
        type:String,
        required:true
    },
    category:{
        type:Array,
        required:true
    },
    tags:{
        type:Array
    },
    featuredPost:{
        type:String,
        required:false
    },
    featured:{
        type:Object,
        required:false
    },
    created:{
        type:String,
        required:false
    },
    edited:{
        type:Date,
        required:false
    }
}
,{
   timestamps:true 
}
)

let Article=module.exports=mongoose.model('Article',articleSchema)