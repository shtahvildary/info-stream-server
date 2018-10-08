/**
 *          .::EXPRESS PLUGINS::.
 * Express plugins and all adding data to req and res are here.
 * 
 */
var isValid =require ('./isValid');
module.exports= (req, res, next)=> {
	validators(req,res);

	next();
}
//ADDING REQUEST AND RESPONSE VALIDATORS TO REQUEST
let validators=(req,res)=>{
	res.validSend=isValid.res;
	req.res=res;
	req.validate=isValid.req;
	
	
}