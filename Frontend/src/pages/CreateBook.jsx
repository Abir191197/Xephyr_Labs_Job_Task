import { useState, useEffect } from "react";
import { deleteBook, fetchBook, addBook, updateBook } from "../Api/api";
import { toast } from "react-toastify";

const BookApp = () => {
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const emptyBook = {
    title: "",
    author: "",
    genre: "",
    language: "",
    page_count: "",
    published_year: "",
    summary: "",
  };

  const [formData, setFormData] = useState(emptyBook);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetchBook();
      setBooks(Array.isArray(response) ? response : [response]);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching books:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        const { _id, ...updatedBook } = formData; // Exclude _id here
        await updateBook(_id, updatedBook);
        toast.success("Book updated successfully!");
      } else {
        await addBook(formData);
        toast.success("Book added successfully!");
      }
      fetchBooks();
      setFormData(emptyBook);
      setIsAddingBook(false);
      setEditingBook(null);
    } catch (error) {
      toast.error("Failed to save book!");
      console.error("Error saving book:", error);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await deleteBook(id);
        toast.success("Book deleted successfully!");
        fetchBooks();
      } catch (error) {
        toast.error("Failed to delete book!");
        console.error("Failed to delete book:", error);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData(book);
    setIsAddingBook(true);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Book Management</h1>
        <button
          onClick={() => {
            setIsAddingBook(true);
            setFormData(emptyBook);
            setEditingBook(null);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add New Book
        </button>
      </div>

      {isAddingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(emptyBook).map((field) => (
                  <div key={field}>
                    <label className="block mb-1 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type={
                        field.includes("count") || field.includes("year")
                          ? "number"
                          : "text"
                      }
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBook(false);
                    setEditingBook(null);
                    setFormData(emptyBook);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book._id}
            className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-xl font-bold mb-2">{book.title}</h3>
            <div className="space-y-2">
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Language:</strong> {book.language}
              </p>
              <p>
                <strong>Pages:</strong> {book.page_count}
              </p>
              <p>
                <strong>Published:</strong> {book.published_year}
              </p>
              <p className="text-sm text-gray-600">{book.summary}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleEdit(book)}
                className="px-3 py-1 border rounded hover:bg-gray-100">
                Edit
              </button>
              <button
                onClick={() => handleDelete(book._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookApp;
