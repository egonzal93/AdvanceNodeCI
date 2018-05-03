/**
 * Created by Jason Gonzales on 4/24/18.
 */


const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = () => {

    return new User({}).save();


};