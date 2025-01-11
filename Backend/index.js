const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    },
});

//====================Database connection Start=========================== 

async function connectToDatabase() {
    try {
        await client.connect();
        console.log(' Connected to MongoDB');
    } catch (error) {
        console.error(' MongoDB connection error:', error);
    }
}

connectToDatabase();
//====================Database connection End ===========================



// MongoDB Collection Reference
const BooksDatabase = client.db("Xephyr_Labs_Task").collection("Book");



//Create Book API

// POST Endpoint with Error Handling and Validation

app.post('/CreateBook', async (req, res) => {
    const { title, author, genre, published_year, language, page_count, summary } = req.body;

    // Basic Input Validation
    if (!title || !author || !published_year ) {
        return res.status(400).json({ error: 'Invalid input data. Please check required fields.' });
    }

    try {
        //  insert the book into the database
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

        const result = await BooksDatabase.insertOne(newBook);

      
        res.status(201).json({ message: 'Book created successfully!' });

    } catch (error) {
        console.error('Error creating book:', error.message);

       
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});















// Home Route
app.get('/', (req, res) => {
    res.send(' Application is Running');
});

// Start Server
app.listen(port, () => {
    console.log(` Server is running on http://localhost:${port}`);
});
