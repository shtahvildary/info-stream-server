const express = require('express');
const mosaicController = require('../controllers/mosaic');
// var  {hasChanged} =require ('../controllers/streams');


  // console.log('context:' ,context)
  let routes = express.Router();
  // routes.get('/', streamController.getStreams.bind(context));
  // routes.get('/:app/:stream', streamController.getStream.bind(context));
  routes.post('/start',mosaicController.mosaic_start);
  routes.post('/stop',mosaicController.mosaic_stop);


  module.exports=routes;
