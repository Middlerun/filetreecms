require('dotenv').config()
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const express = require('express')
const app = express()

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object
}

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

      let meta = {}
      if (files.includes('.meta.yml')) {
        try {
          meta = yaml.safeLoad(fs.readFileSync(path.join(filePath, '.meta.yml'), 'utf8'))
          if (!isObject(meta)) {
            throw new Error('Invalid format')
          }
        } catch (e) {
          console.log('.meta.yml parse error:', req.originalUrl, e)
          meta = {}
        }
      }

      const responseObject = {
        type: 'directory',
        contents: availableFiles.map(filename => {
          const fileObj = {
            name: filename,
            path: `/content/${contentPath}/${filename}`
          }
          if (meta[filename]) {
            fileObj.meta = meta[filename]
          }
          return fileObj
        }),
      }

      res.send(responseObject)
    }
  })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
