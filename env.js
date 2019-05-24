/**
 *          .::ENVIRONMENT PARSING::.
 * Parsing .env files and defining Project mode(Development, Production)
 * 
 */
let dotenvPath = "./.home.env"
let projectMode = "Home"
let dotenv =require( "dotenv")
let path =require("path")
process
  .argv
  .forEach((val, index, array) => {
    switch (val) {
      case "--server":
        projectMode = "Server"
        return dotenvPath = './.env';
        break;

      //Add more commands here
      default:
    }
  });

dotenv.config({
  path: path.resolve(__dirname, dotenvPath),
});
process.env.projectMode=projectMode;