var { ServerRequest } =require ("http");
var express=require("express")

/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
var streams =require('./streams');


//USING ROUTES
routes.use('/streams',streams);
module.exports=routes
