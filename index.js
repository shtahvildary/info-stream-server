//
//  Created by Mingliang Chen on 18/6/20.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//

const StreamCreator = require('./src/StreamCreator');
const Mosaic = require('./src/mosaic-ffmpeg');
// const NodeRtmpClient = require('./node_rtmp_client');


//mdc
global.serverAddress = "http://172.16.16.164:5000/api";
// global.serverAddress = "http://localhost:5000/api";


module.exports = {
  StreamCreator,
  Mosaic,
  // NodeRtmpClient
};


/**
 *          .::MAIN FILE::.
 * 
 * 
 */
// import vars from "./globals";
// import './config/env';




// import './config/database';
var routes=require( './api/routes');
var CORS =require ('./middlewares/CORS');
var ExpressPlugins = require ('./middlewares/ExpressPlugins');
var express=require("express")
const app = express();
var bodyParser = require('body-parser')
var path=require('path');


// Middlewares
app.use(bodyParser.json());
app.use(CORS);
app.use(ExpressPlugins);

// routes
routes.post('/', (req, res) => res.json({
  message: Project.Name+ ' API'
}));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err,req,res,next)=>{
  if(!err) return res.validSend(201,{});
  if(!err.status)err.status=500;
  return res.status(err.status).json({error:"error: "+err.message})
})

const port = process.env.API_PORT || 8001;


var server=app.listen(port, (err) => {
  if (err) {
    console.error(err)
  }

  console.info(`listening on port`, Number(port))
});
