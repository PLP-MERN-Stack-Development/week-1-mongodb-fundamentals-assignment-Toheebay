// Write MongoDB queries to

db.books.find({genre:'History'}).toArray();

db.books.find({ published_year: { $gt: 2011 } }).toArray();

db.books.find({ author: 'James Clear' }).toArray();

db.books.updateOne(
    { title: 'Atomic Habits' },
    { $set: { price: 18.00 } }
  );

  db.books.deleteOne({ title: 'The Lean Startup' });

//   Answer to question3

db.books.find({
    published_year: { $gt: 2010 },
    in_stock: true
  });
  
// Answer to question 3ii

  db.books.find(
    {
      published_year: { $gt: 2010 },
      in_stock: true
    },
    {
      title: 1,
      author: 1,
      price: 1,
      _id: 0
    }
  );
  
//   Answer to question 3iv   ascending order
db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: 1 });

  // descending order
  db.books.find({}, { title: 1, price: 1, _id: 0 }).sort({ price: -1 });

//  Use the `limit` and `skip` methods to implement pagination (5 books per page)
// Assuming you want page 1 (the first 5 books):

 db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
  .skip(0)    // (pageNumber - 1) * pageSize = (1-1)*5 = 0
  .limit(5);

//   For page 2 (books 6 to 10):

  db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
  .skip(5)    // (2-1)*5 = 5
  .limit(5);

//   Aggregation Pipeline
//  Create an aggregation pipeline to calculate the average price of books by genre

  db.books.aggregate([
    {
      $group: {
        _id: "$genre",               // Group by genre
        averagePrice: { $avg: "$price" } // Calculate average price
      }
    },
    {
      $project: {
        _id: 0,
        genre: "$_id",
        averagePrice: { $round: ["$averagePrice", 2] } // Round to 2 decimal places
      }
    }
  ]);
  
//   Create an aggregation pipeline to find the author with the most books in the collection

  db.books.aggregate([
    {
      $group: {
        _id: "$author",             // Group by author
        totalBooks: { $sum: 1 }     // Count number of books per author
      }
    },
    {
      $sort: { totalBooks: -1 }     // Sort descending by total books
    },
    {
      $limit: 1                     // Only return the top author
    }
  ]);
  
//   Implement a pipeline that groups books by publication decade and counts them

  db.books.aggregate([
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
    {
      $sort: { _id: 1 } // Sort by decade
    }
  ]);
  
//   Task 5: Indexing
//   - Create an index on the `title` field for faster searches
  db.books.createIndex({ title: 1 });


//   Create a compound index on `author` and `published_year`
  db.books.find({ author: "George Orwell", published_year: 1945 });

// Finally
//   Use the `explain()` method to demonstrate the performance improvement with your indexes

  db.books.find({ author: "George Orwell", published_year: 1945 }).explain("executionStats");



