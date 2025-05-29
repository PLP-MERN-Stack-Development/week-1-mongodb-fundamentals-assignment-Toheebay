// queries.js

const { MongoClient } = require("mongodb");

async function runQueries() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const db = client.db("library");
    const books = db.collection("books");

    // 1. Find books by genre
    const historyBooks = await books.find({ genre: 'History' }).toArray();
    console.log("History Books:", historyBooks);

    // 2. Find books published after 2011
    const recentBooks = await books.find({ published_year: { $gt: 2011 } }).toArray();
    console.log("Books published after 2011:", recentBooks);

    // 3. Find books by James Clear
    const jamesClearBooks = await books.find({ author: 'James Clear' }).toArray();
    console.log("Books by James Clear:", jamesClearBooks);

    // 4. Update book price
    await books.updateOne(
      { title: 'Atomic Habits' },
      { $set: { price: 18.00 } }
    );
    console.log("Updated Atomic Habits price.");

    // 5. Delete a book
    await books.deleteOne({ title: 'The Lean Startup' });
    console.log("Deleted 'The Lean Startup'");

    // 6. Find books published after 2010 and in stock
    const availableRecentBooks = await books.find({
      published_year: { $gt: 2010 },
      in_stock: true
    }).toArray();
    console.log("Recent books in stock:", availableRecentBooks);

    // 7. Select only title, author, and price
    const selectedFields = await books.find(
      {
        published_year:_ 
