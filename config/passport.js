const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const config = require('../config/database')
const User = require('../models/user')

module.exports = (passport)=>{

passport.use(new LocalStrategy((username,password,done)=>{

User.findOne({username:username}).then((user)=>{
    if(!user){
        return done(null,false,{message:'No user found'})
    }


    bcrypt.compare(password,user.password,(err,isMatch)=>{
        if(err)throw err
        if(isMatch){
            return done(null,user)
        }else{
            return done(null,false,{message:'wrong password'})
        }
    })
}).catch((err)=>{
    if(err)console.log(err)
})

}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    }).catch(()=>done(null,false))
})

}
