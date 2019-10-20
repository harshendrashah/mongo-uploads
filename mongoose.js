const mongoose = require('mongoose');

//Mongo URI
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mongo-uploads';

//Create mongo connection
const conn = mongoose.createConnection(mongoURI);

module.exports = { mongoURI, conn }

