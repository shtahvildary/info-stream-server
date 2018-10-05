//
//  Created by Mingliang Chen on 18/6/20.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//

const StreamCreator = require('./src/StreamCreator');
const Mosaic = require('./src/mosaic-ffmpeg');
// const NodeRtmpClient = require('./node_rtmp_client');

global.serverAddress = "http://localhost:5000/api";


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
import routes from './api/routes';
import CORS from './middlewares/CORS';
import ExpressPlugins from './middlewares/ExpressPlugins';

const app = express();


// Middlewares
app.use(bodyParser.json());
app.use(CORS);
app.use(ExpressPlugins);

// Routes
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
  return res.status(err.status).json({error:err.message})
})

const port = process.env.API_PORT || 8001;


var server=app.listen(port, (err) => {
  if (err) {
    console.error(err)
  }

  console.info(`listening on port`, Number(port))
});
