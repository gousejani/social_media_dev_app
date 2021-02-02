const mongoose = require('mongoose');
// require('config');
require('dotenv').config();
const db = process.env.MONGO_URI;

const connectDB = async ()=>{
    try {
        await mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true })
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with faiure
        process.exit(1);
    }
}

module.exports = connectDB;
