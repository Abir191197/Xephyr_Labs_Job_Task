const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 7000;

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection string using environment variables
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@pawpedia.8x3yu.mongodb.net/?retryWrites=true&w=majority&appName=PawPedia`;

// MongoDB Client Setup
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Database connection handler
let dbConnection;

async function connectToDatabase() {
    try {
        if (!dbConnection) {
            await client.connect();
            dbConnection = client.db("Xephyr_Labs_Task");
            console.log('Connected to MongoDB');
        }
        return dbConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Middleware to ensure database connection
app.use(async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        req.db = db;
        next();
    } catch (error) {
        res.status(500).json({
            error: 'Database connection failed',
            details: error.message
        });
    }
});

// Create Book
app.post('/Books', async (req, res) => {
    const { title, author, genre, published_year, language, page_count, summary } = req.body;

    if (!title || !author || !published_year) {
        return res.status(400).json({ error: 'Invalid input data. Please check required fields.' });
    }

    try {
        const BooksCollection = req.db.collection("Book");
        const newBook = {
            title,
            author,
            genre,
            published_year,
            language,
            page_count,
            summary,
            createdAt: new Date()
        };

        const result = await BooksCollection.insertOne(newBook);
        res.status(201).json({ message: 'Book created successfully!' });
    } catch (error) {
        console.error('Error creating book:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

// Fetch all books
app.get('/Books', async (req, res) => {
    try {
        const BooksCollection = req.db.collection("Book");
        const books = await BooksCollection.find({}).sort({ createdAt: -1 }).toArray();

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found.' });
        }

        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});


// Delete a book
app.delete('/Books/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const BooksCollection = req.db.collection("Book");
        const objectId = new ObjectId(id);
        const result = await BooksCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        res.status(200).json({ message: 'Book deleted successfully.' });
    } catch (error) {
        console.error('Error deleting book:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

// Update book
app.put('/Books/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        const BooksCollection = req.db.collection("Book");
        const objectId = new ObjectId(id);
        const result = await BooksCollection.findOneAndUpdate(
            { _id: objectId },
            { $set: updatedData }
        );

        if (!result) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        res.status(200).json({ message: 'Book updated successfully.' });
    } catch (error) {
        console.error('Error updating book:', error.message);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

// Home Route
app.get('/', (req, res) => {
    res.send('Application is Running');
});

//  shutdown handler
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});