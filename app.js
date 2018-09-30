var httpAttach = require('http-attach') // useful module for attaching middlewares
var HLSServer = require('hls-server')
var http = require('http')
// const StreamCreator=require('./src/StreamCreator')
var mosaic=require('./src/mosaic-ffmpeg')

var myMosaic=new mosaic;
myMosaic.createMosaic();
var server = http.createServer()


const silence = new StreamCreator(server, {
  width : 640,
  height: 480,
});

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

