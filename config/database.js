const dotenv = require('dotenv')

dotenv.config({path:'./config/eazyblog.env'})


module.exports={
    database:process.env.DATABASE,
    secret:process.env.SECRET
}