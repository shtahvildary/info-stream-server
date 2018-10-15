const express = require('express');
const streamController = require('../controllers/streams');
// var  {change_state} =require ('../controllers/streams');

// module.exports = (context) => {
//   let routes = express.Router();
//   // routes.get('/', streamController.getStreams.bind(context));
//   // routes.get('/:app/:stream', streamController.getStream.bind(context));
//   routes.post('/state/change',streamController.change_state);

//   return routes;
// };


const routes=express.Router();
routes.post('/state/change',streamController.change_state(req,res))
module.exports=routes

