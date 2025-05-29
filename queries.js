const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB URI
const uri = 'mongodb://localhost:27017'; // Use your MongoDB Atlas URI if you're not running locally
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('plp_bookstore'); // Your database name

    const books = await db.collection('books').find({ genre: 'History' }).toArray();
    console.log(books);
  } catch (err) {
    console.error('Error running query:', err);
  } finally {
    await client.close();
  }
}

run();
