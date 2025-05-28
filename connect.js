const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const books = [
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', published_year: 2011, price: 14.99, in_stock: true },
  { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', published_year: 2018, price: 13.50, in_stock: true },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', published_year: 2018, price: 16.00, in_stock: true },
  { title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity', published_year: 2016, price: 12.99, in_stock: true },
  { title: 'Can’t Hurt Me', author: 'David Goggins', genre: 'Memoir', published_year: 2018, price: 15.00, in_stock: true },
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', genre: 'Finance', published_year: 1997, price: 10.99, in_stock: true },
  { title: 'Start With Why', author: 'Simon Sinek', genre: 'Leadership', published_year: 2009, price: 11.99, in_stock: true },
  { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', genre: 'Self-help', published_year: 2016, price: 14.00, in_stock: false },
  { title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', published_year: 2011, price: 13.75, in_stock: true },
  { title: 'Think and Grow Rich', author: 'Napoleon Hill', genre: 'Motivation', published_year: 1937, price: 9.99, in_stock: true }
];

async function run() {
  try {
    await client.connect();
    const db = client.db('plp_bookstore');
    const book = db.collection('books'); // ✅ fixed name

    const count = await book.countDocuments();
    if (count === 0) {
      await book.insertMany(books);
      console.log('Sample books inserted.');
    } else {
      console.log(`Collection already has ${count} books.`);
    }

    const allBook = await book.find({}).toArray();
    console.log('\n📚 All Books:\n');
    allBook.forEach((b, i) => {
      console.log(`${i + 1}. "${b.title}" by ${b.author} (${b.published_year})`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
