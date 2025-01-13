# API Documentation for Book Management System

## Live Link
- **Frontend:** [https://xephyr-labs-job-task.vercel.app](https://xephyr-labs-job-task.vercel.app)
- **Backend API:** [https://xephyr-labs-job-task-backend.vercel.app](https://xephyr-labs-job-task-backend.vercel.app)

## Tech Stack
- React.js
- Tailwind CSS
- Node.js
- Express.js
- MongoDB

## Prerequisites
- Node.js installed
- MongoDB Atlas cluster set up


## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Abir191197/Xephyr_Labs_Job_Task.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Xephyr_Labs_Job_Task
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   cd Frontend
   npm install
   cd ../Backend
   npm install
   ```
4. Create a `.env` file inside the `Backend` folder with the following content:
   ```plaintext
   DB_USER=abir908
   DB_PASS=-KZnWm.B74ti48Q
   ```
5. Start the server and frontend concurrently:
   ```bash
   cd Backend
   npm run dev
   cd ../Frontend
   npm run dev
   ```
6. The backend will be running at `http://localhost:7000` and the frontend at `http://localhost:5173/`.

## Running the Application Locally
Ensure you have MongoDB Atlas credentials set up in the `.env` file located in the `Backend` folder.

Start both frontend and backend using:
```bash
npm run dev
```

## API Details

### 1. Create a New Book
**Endpoint:** `POST /Books`

**Request Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "published_year": 2023,
  "language": "English",
  "page_count": 300,
  "summary": "A short summary of the book."
}
```
**Response:**
- `201 Created`: Book created successfully.
- `400 Bad Request`: Missing required fields.

---

### 2. Fetch All Books
**Endpoint:** `GET /Books`

**Response:**
- `200 OK`: Returns a list of books sorted by `createdAt` in descending order.
- `404 Not Found`: No books found.

---

### 3. Delete a Book
**Endpoint:** `DELETE /Books/:id`

**Parameters:**
- `id`: The ObjectId of the book to delete.

**Response:**
- `200 OK`: Book deleted successfully.
- `404 Not Found`: Book not found.

---

### 4. Update a Book
**Endpoint:** `PUT /Books/:id`

**Parameters:**
- `id`: The ObjectId of the book to update.

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author"
}
```
**Response:**
- `200 OK`: Book updated successfully.
- `404 Not Found`: Book not found.

