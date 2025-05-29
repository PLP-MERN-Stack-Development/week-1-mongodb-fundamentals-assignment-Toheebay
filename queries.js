// queries.js

const { MongoClient } = require("mongodb");

async function runQueries() {
  const client = new MongoClient("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db("library");
    const books = db.collection("books");

    // Example query
    const sciFiBooks = await books.find({ genre: "Science Fiction" }).toArray();
    console.log("Sci-Fi Books:", sciFiBooks);
  } catch (error) {
    console.error("Error running queries:", error);
    process.exit(1); // force failure in CI if query fails
  } finally {
    await client.close();
  }
}

runQueries();
