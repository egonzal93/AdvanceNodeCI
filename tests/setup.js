/**
 * Created by Jason Gonzales on 4/24/18.
 */

jest.setTimeout(30000);

require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');


mongoose.Promise = global.Promise;
mongoose.connect( keys.mongoURI, { useMongoClient: true });


