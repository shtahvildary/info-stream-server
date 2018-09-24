/**
 *          .::GLOBAL MODULES::.
 * Require any module here and it will be available everywhere
 * 
 */
export default {
    //Sherytech modules
    sherylogger:require('shery-logger'),
    
    //Data storing modules
    mongoose: require('mongoose'),
    mongooseTimestamp:require('mongoose-timestamp'),
    
    //Tool modules
    _: require('lodash'),
    async: require('async'),
    validator: require('validator'),
    logger: require('morgan'),
    bodyParser: require('body-parser'),
    path:require('path'),

    //Encryption modules
    bcrypt:require('bcrypt'),
    jwt:require('jsonwebtoken'),
    
    //Server handling modules
    express: require('express'),

    //Configuration modules
    dotenv:require('dotenv'),
}