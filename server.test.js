const path = require('path')
const request = require('supertest')

const startServer = require('./server')

const port = process.env.TEST_PORT || 3002
let server

describe('the server', () => {
  beforeAll(() => {
    server = startServer(path.join(__dirname, 'test_fixtures'), port)
  })

  afterAll(() => {
    server.close()
  })

  describe('listing files in a directory', () => {
    it('lists files in a directory', (done) => {
      request(server)
        .get('/content/')
        .expect(200)
        .then(response => {
          expect(response.body).toEqual(
            {
              type: 'directory',
              contents: [
                { name: 'bar.txt', path: '/content/bar.txt' },
                { name: 'foo', path: '/content/foo' },
                { name: 'fox.jpg', path: '/content/fox.jpg' },
              ],
            }
          )
          done()
        })
    })

    it('excludes dot files in directory contents', (done) => {
      request(server)
        .get('/content/foo')
        .expect(200)
        .then(response => {
          expect(response.body.contents.find(file => file.name === '.meta.yml')).toBeFalsy()
          done()
        })
    })

    it('allows directories starting with a dot', (done) => {
      request(server)
        .get('/content/foo/.dotfolder')
        .expect(200, done)
    })

    it('includes file metadata from .meta.yml', (done) => {
      request(server)
        .get('/content/foo')
        .expect(200)
        .then(response => {
          expect(response.body.contents.find(file => file.name === 'baz.json').meta)
            .toEqual({someMeta: 'data'})
          done()
        })
    })
  })

  describe('getting files', () => {
    it('returns the content of a text file with correct MIME type', (done) => {
      request(server)
        .get('/content/bar.txt')
        .expect(200)
        .expect('Content-Type', /text/)
        .then(response => {
          expect(response.text).toEqual('bar\n')
          done()
        })
    })

    it('returns the content of a JSON file with correct MIME type', (done) => {
      request(server)
        .get('/content/foo/baz.json')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body).toEqual({baz: true})
          done()
        })
    })

    it('returns the content of a JPEG file with correct MIME type', (done) => {
      request(server)
        .get('/content/fox.jpg')
        .expect(200)
        .expect('Content-Type', /jpeg/)
        .end(done)
    })

    it('returns 404 for a nonexistent file', (done) => {
      request(server)
        .get('/content/notreal.txt')
        .expect(404, done)
    })

    it('returns 404 for a dot file', (done) => {
      request(server)
        .get('/content/foo/.meta.yml')
        .expect(404, done)
    })
  })
})
