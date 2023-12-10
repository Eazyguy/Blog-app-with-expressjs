
module.exports = (req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('danger','Access Denied Please login')
        req.session.redirectTo=req.originalUrl
        res.redirect('/login')
    }
}