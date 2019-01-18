var httpAttach = require('http-attach') // useful module for attaching middlewares
var HLSServer = require('hls-server')
var http = require('http')
const {StreamCreator,Mosaic}=require('./index');


// const StreamCreator=require('./src/StreamCreator')
// var mosaic=require('./src/mosaic-ffmpeg')

// var myMosaic=new mosaic;
// myMosaic.createMosaic();
var server = http.createServer()

const 
  inputs=[
    // { id:1,name:'out',address:'/Users/shadab/Downloads/video_2017-08-09_18-26-12.mp4',dshow:0},
    // {id:1, name: 'tv1', address: "http://172.16.16.103:1371",dshow:0 },
  //  { id:2,name: 'tv2', address: "http://172.16.16.103:1372",dshow:0 },
  //  { id:3,name: 'tv3', address: "http://172.16.16.103:1373",dshow:0 },
  //  { id:4,name: 'tv4', address: "http://172.16.16.103:1374",dshow:0 },
  //  { id:5,name: 'tv5', address: "http://172.16.16.103:1375",dshow:0 },
  //  { id:6,name: 'amoozesh', address: "http://172.16.16.103:1376",dshow:0 },
  //  { id:7,name: 'quran', address: "http://172.16.16.103:1377",dshow:0 },
  //  { id:8,name: 'salamat', address: "http://172.16.16.103:1378",dshow:0 },
  //  { id:9,name: 'nasim', address: "http://172.16.16.103:1379",dshow:0 },
  //  { id:10,name: 'mostanad', address: "http://172.16.16.103:1380",dshow:0 },
  //  { id:11,name: 'namayesh', address: "http://172.16.16.103:1381",dshow:0 },
  //  { id:12,name: 'ofogh', address: "http://172.16.16.103:1382",dshow:0 },
  //  { id:13,name: 'varzesh', address: "http://172.16.16.103:1383",dshow:0 },
  //  { id:14,name: 'pooya', address: "http://172.16.16.103:1384",dshow:0 },
  //  { id:15,name: 'tamasha', address: "http://172.16.16.103:1385",dshow:0 },
  //  { id:16,name: 'tv3HD', address: "http://172.16.16.103:1386",dshow:0 },
  //  { id:17,name: 'omid', address: "http://172.16.16.103:1387",dshow:0 },
  //  { id:18,name: 'jam_e_jam', address: "http://172.16.16.103:1388",dshow:0 },
  //  { id:19,name: 'irinn', address: "http://172.16.16.103:1389",dshow:0 },
  //  { id:20,name: 'SDI', address:'video="Blackmagic WDM Capture"',dshow:1 },
],

mosaicConfig=[{id:1, name: 'tv1', address: "http://172.16.16.103:1371" },
{ id:2,name: 'tv2', address: "http://172.16.16.103:1372" },
{ id:3,name: 'tv3', address: "http://172.16.16.103:1373" },
{ id:4,name: 'tv4', address: "http://172.16.16.103:1374" },
{ id:5,name: 'tv5', address: "http://172.16.16.103:1375" },
{ id:6,name: 'amoozesh', address: "http://172.16.16.103:1376" },
{ id:7,name: 'quran', address: "http://172.16.16.103:1377" },
{ id:8,name: 'salamat', address: "http://172.16.16.103:1378" },
{ id:9,name: 'nasim', address: "http://172.16.16.103:1379" },
{ id:10,name: 'mostanad', address: "http://172.16.16.103:1380" },
{ id:11,name: 'namayesh', address: "http://172.16.16.103:1381" },
{ id:12,name: 'ofogh', address: "http://172.16.16.103:1382" },
{ id:13,name: 'varzesh', address: "http://172.16.16.103:1383" },
{ id:14,name: 'pooya', address: "http://172.16.16.103:1384" },
{ id:15,name: 'tamasha', address: "http://172.16.16.103:1385" },
{ id:16,name: 'tv3HD', address: "http://172.16.16.103:1386" },]
var server = http.createServer()


// var tsCreator=new StreamCreator()
//   tsCreator.start(inputs)


// var mosaicCreator=new Mosaic(mosaicConfig)
// mosaicCreator.start()




var hls = new HLSServer(server, {
  path: '',     // Base URI to output HLS streams
  // dir: '/Users/shadab/desktop/hls-test'  // Directory that input files are stored
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

