import { MongoClient } from 'mongodb'


// Connect to MongoDB
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbClient = new MongoClient(mongoURL);

const db = dbClient.db('pastebin');
const pastes = db.collection('pastes');

export { db, pastes }