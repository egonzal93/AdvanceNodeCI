/**
 * Created by Jason Gonzales on 4/2/18.
 */

const { clearHash } =  require('../services/cache');


module.exports = async (req, res, next) => {

    // Allow route handler to run first and finish, then after it completes, then the code below is executed.
    await next();

    clearHash(req.user.id);

}