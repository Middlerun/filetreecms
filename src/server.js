const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const express = require('express')

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object
}

function startServer(contentRoot, port, corsOrigin) {
  const server = express()

  if (corsOrigin) {
    server.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", corsOrigin)
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
      next()
    })
  }

  server.use('/content', express.static(
    contentRoot,
    { redirect: false }
  ))

  server.get(/^\/content$/, (req, res) => {
    res.redirect('/content/')
  })

  server.get('/content/*', (req, res) => {
    const contentPath = req.params[0].replace(/\/$/, '')
    const filePath = path.join(contentRoot, contentPath)

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
              path: `/content${contentPath ? '/' + contentPath : ''}/${filename}`,
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

  return server.listen(port, () => console.log(`Listening on port ${port}`))
}

module.exports = startServer
