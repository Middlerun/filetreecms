require('dotenv').config()
const path = require('path')

const startServer = require('./server')

const contentRoot = process.env.CONTENT_ROOT || path.join(__dirname, '../content')
const port = process.env.PORT || 3000
const corsOrigin = process.env.ACCESS_CONTROL_ALLOW_ORIGIN

startServer(contentRoot, port, corsOrigin)
