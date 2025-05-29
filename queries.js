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
        published_year: { $gt: 2010 },
        in_stock: true
      },
      {
        projection: { title: 1, author: 1, price: 1, _id: 0 }
      }
    ).toArray();
    console.log("Selected Fields:", selectedFields);

    // 8. Sort books by price (ascending)
    const sortedAsc = await books.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: 1 }).toArray();
    console.log("Books sorted by price (asc):", sortedAsc);

    // 9. Sort books by price (descending)
    const sortedDesc = await books.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: -1 }).toArray();
    console.log("Books sorted by price (desc):", sortedDesc);

    // 10. Pagination (Page 1)
    const page1 = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } })
      .skip(0)
      .limit(5)
      .toArray();
    console.log("Page 1:", page1);

    // 11. Pagination (Page 2)
    const page2 = await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } })
      .skip(5)
      .limit(5)
      .toArray();
    console.log("Page 2:", page2);

    // 12. Average price of books by genre
    const avgPriceByGenre = await books.aggregate([
      {
        $group: {
          _id: "$genre",
          averagePrice: { $avg: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          averagePrice: { $round: ["$averagePrice", 2] }
        }
      }
    ]).toArray();
    console.log("Average Price by Genre:", avgPriceByGenre);

    // 13. Author with most books
    const topAuthor = await books.aggregate([
      {
        $group: {
          _id: "$author",
          totalBooks: { $sum: 1 }
        }
      },
      { $sort: { totalBooks: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log("Author with most books:", topAuthor);

    // 14. Group books by publication decade
    const booksByDecade = await books.aggregate([
      {
        $project: {
          decade: {
            $concat: [
              { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
              "s"
            ]
          }
        }
      },
      {
        $group: {
          _id: "$decade",
          totalBooks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log("Books by decade:", booksByDecade);

    // 15. Create index on title
    await books.createIndex({ title: 1 });
    console.log("Created index on 'title'");

    // 16. Compound query + explain
    const explainResult = await books.find({ author: "George Orwell", published_year: 1945 }).explain("executionStats");
    console.log("Explain stats for compound query:", explainResult.executionStats);

  } catch (error) {
    console.error("Error running queries:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runQueries();
