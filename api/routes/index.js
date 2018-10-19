var { ServerRequest } =require ("http");
var express=require("express")

/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
var streams =require('./streams');
var mosaic =require('./mosaic');


//USING ROUTES
routes.use('/streams',streams);
routes.use('/mosaic',mosaic)
module.exports=routes
