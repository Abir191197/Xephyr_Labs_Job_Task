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
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
}

connectToDatabase();
//====================Database connection End ===========================



// MongoDB Collection Reference
const test = client.db("Xephyr_Labs_Task").collection("Book");

// Sample API Route to fetch Books
app.get('/', async (req, res) => {
    try {
        const courses = await test.find().toArray();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

//













// Home Route
app.get('/', (req, res) => {
    res.send('✅ Application is Running');
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
