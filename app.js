var httpAttach = require('http-attach') // useful module for attaching middlewares
var HLSServer = require('hls-server')
var http = require('http')

var server = http.createServer()

var hls = new HLSServer(server, {
  path: '',     // Base URI to output HLS streams
  dir: '/Users/shadab/Downloads/hls-server-master/test/files/output'  // Directory that input files are stored
  // dir: 'D:/hls-test'  // Directory that input files are stored
  // dir: 'public/videos'  // Directory that input files are stored
})

function yourMiddleware (req, res, next) {
    // set your headers here
    res.setHeader('Access-Control-Allow-Origin', '*');
    next()
}
httpAttach(server, yourMiddleware)
server.listen(8000)
console.log(`server is running...`)

