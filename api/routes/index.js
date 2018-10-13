var { ServerRequest } =require ("http");
var express=require("express")

/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
var streams =require('./streams');
// import streams from'./streams';


//USING ROUTES
routes.use('/streams',streams);
// exports.routes=routes
module.exports=routes
// export default routes;