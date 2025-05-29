const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // GitHub Actions uses localhost
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db('plp_bookstore');
    const books = await db.collection('books').find({ genre: 'History' }).toArray();
    console.log(books);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
