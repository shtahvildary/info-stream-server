/**
 *          .::ROUTES::.
 * All routes are imported here.
 * 
 */
const routes = express.Router();
import streams from './streams';


//USING ROUTES
routes.use('/streams',streams);

export default routes;