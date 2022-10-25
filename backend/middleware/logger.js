const mongooseMorgan = require('mongoose-morgan');
const dotenv = require('dotenv').config();

const DB = process.env.MONGODB_BD;

const MORGAN = mongooseMorgan(  
    // DB object with connection string and target collection
    {   
     collection: 'error-logs',    
     connectionString: DB  
    },
    // Options object. Custom preferences
    {    skip: function (req, res) {
        return res.statusCode < 400;
    }
},
    // Logging format
    ':method :url :status :response-time ms - :res[content-length] [:date[web]]'
); 
// Export Middleware
module.exports = MORGAN;