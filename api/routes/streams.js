const express = require('express');
const streamController = require('../controllers/streams');
// var  {hasChanged} =require ('../controllers/streams');


  // console.log('context:' ,context)
  let routes = express.Router();
  // routes.get('/', streamController.getStreams.bind(context));
  // routes.get('/:app/:stream', streamController.getStream.bind(context));
  routes.post('/state/change',streamController.change_state);


  module.exports=routes;
