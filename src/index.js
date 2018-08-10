require('dotenv').config()
const path = require('path')

const startServer = require('./server')

const contentRoot = process.env.CONTENTROOT || path.join(__dirname, '../content')
const port = process.env.PORT || 3000

startServer(contentRoot, port)