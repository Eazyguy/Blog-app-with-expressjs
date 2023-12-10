const mongoose = require('mongoose')

const settingsSchema = mongoose.Schema({
    category:{
        type:Array
    }
})

let Settings = module.exports=mongoose.model('Settings',settingsSchema)