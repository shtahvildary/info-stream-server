var httpAttach = require('http-attach') // useful module for attaching middlewares
var HLSServer = require('hls-server')
var http = require('http')
const {StreamCreator}=require('./index');

const config = {
  
  trans: {
    ffmpeg: 'D:/Softwares/ffmpeg-20180828-26dc763-win64-static/ffmpeg-20180828-26dc763-win64-static/bin',
    // ffmpeg: '/usr/local/bin/ffmpeg',
    tasks: [
      {
        
        ac: 'aac',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=0:hls_flags=delete_segments]',
        
      }
    ]
  }
};
var server = http.createServer()
var tsCreator=new StreamCreator(config)
tsCreator.coding()


var hls = new HLSServer(server, {
  path: '',     // Base URI to output HLS streams
  // dir: '/Users/shadab/Downloads/hls-server-master/test/files/output'  // Directory that input files are stored
  dir: 'D:/hls-test'  // Directory that input files are stored
  // dir: 'public/videos'  // Directory that input files are stored
})

function middleware (req, res, next) {
    // set your headers here
    res.setHeader('Access-Control-Allow-Origin', '*');
    next()
}
httpAttach(server, middleware)
server.listen(8000)
console.log(`server is running...`)

