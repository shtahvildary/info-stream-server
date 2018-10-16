const express = require('express');
const streamController = require('../controllers/streams');
// var  {hasChanged} =require ('../controllers/streams');


  // console.log('context:' ,context)
  let routes = express.Router();
  // routes.get('/', streamController.getStreams.bind(context));
  // routes.get('/:app/:stream', streamController.getStream.bind(context));
  routes.post('/start',streamController.stream_start);
  routes.post('/stop',streamController.stream_stop);


  module.exports=routes;
