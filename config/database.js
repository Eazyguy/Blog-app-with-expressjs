const dotenv = require('dotenv')

dotenv.config({ path: './config/eazyblog.env' })

const fallbackDatabase = 'mongodb://127.0.0.1:27017/eazyblog'

module.exports = {
    database: process.env.DATABASE || fallbackDatabase,
    secret: process.env.SECRET || 'change-me'
}