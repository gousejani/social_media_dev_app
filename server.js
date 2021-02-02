const express = require('express');
const connectDB = require('./config/db');

const app = express();
// Connect database
connectDB();

// Routes
app.get('/',(req,res)=>{
    res.send('API running');
})

// Listening
const PORT = process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server started on PORT ${PORT}`));