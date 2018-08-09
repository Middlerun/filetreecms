require('dotenv').config()
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()

const contentRoot = process.env.CONTENTROOT || 'content'
const port = process.env.PORT || 3000

app.use('/content', express.static(
  path.join(__dirname, contentRoot),
  { redirect: false }
))

app.get('/content/*', (req, res) => {
  const contentPath = req.params[0].replace(/\/$/, '')
  const filePath = path.join(__dirname, contentRoot, contentPath)

  fs.readdir(filePath, (err, files) => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        res.sendStatus(404)
      } else {
        console.log('File error:', req.originalUrl, err)
        res.sendStatus(500)
      }
    } else {
      // Serve description of files in directory
      const availableFiles = files.filter(filename => !filename.match(/^\./))

      const responseObject = {
        type: 'directory',
        contents: availableFiles.map(filename => ({
          name: filename,
        })),
      }

      res.send(responseObject)
    }
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
