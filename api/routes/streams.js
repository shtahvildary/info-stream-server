const express = require('express');
const streamController = require('../controllers/streams');
import  {hasChanged} from '../controllers/streams';

module.exports = (context) => {
  console.log('context:' ,context)
  let router = express.Router();
  router.get('/', streamController.getStreams.bind(context));
  router.get('/:app/:stream', streamController.getStream.bind(context));
  routes.post('/hasChanged',streamController.change_state);

  return router;
};
