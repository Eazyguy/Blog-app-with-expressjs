const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        requred:true
    },
    username:{
        type:String,
        requred:true
    },
    email:{
        type:String,
        requred:true
    },
    role:{
        type:String,
        requred:true
    },
    phone:{
        type:Number,
        requred:true
    },
    facebook:{
        type:String,
        requred:false
    },
    twitter:{
        type:String,
        requred:false
    },
    github:{
        type:String,
        requred:false
    },
    linkedin:{
        type:String,
        requred:false
    },
    instagram:{
        type:String,
        required:false
    },
    bio:{
        type:String,
        requred:false
    },
    tags:{
        type:Array
    },
    profile:{
        type:Object,
        requred:false
    },
    password:{
        type:String,
        requred:true
    },
    password2:{
        type:String,
        requred:true
    }
})

let User = module.exports=mongoose.model('User',userSchema)