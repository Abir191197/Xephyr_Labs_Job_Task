import { useState, useEffect } from "react";
import { deleteBook, fetchBook, addBook, updateBook } from "../Api/api";
import { toast } from "react-toastify";
import {
  Trash2,
  Edit2,
  Plus,
  X,
  Book,
  User,
  Hash,
  Calendar,
  Languages,
} from "lucide-react";

const BookApp = () => {
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const emptyBook = {
    title: "",
    author: "",
    genre: "",
    language: "",
    page_count: "",
    published_year: "",
    summary: "",
  };

  const placeholders = {
    title: "Enter book title",
    author: "Enter author name",
    genre: "Enter book genre",
    language: "Enter book language",
    page_count: "Enter number of pages",
    published_year: "Enter publication year",
    summary: "Enter a brief summary of the book",
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
        const { _id, ...updatedBook } = formData;
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

  const handleDelete = async () => {
    try {
      await deleteBook(bookToDelete._id);
      toast.success("Book deleted successfully!");
      fetchBooks();
      setShowDeleteModal(false);
      setBookToDelete(null);
    } catch (error) {
      toast.error("Failed to delete book!");
      console.error("Failed to delete book:", error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData(book);
    setIsAddingBook(true);
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
          <button
            onClick={() => setShowDeleteModal(false)}
            className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete "{bookToDelete?.title}"? This action
            cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 flex items-center gap-2">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Book Management</h1>
        <button
          onClick={() => {
            setIsAddingBook(true);
            setFormData(emptyBook);
            setEditingBook(null);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Add New Book
        </button>
      </div>

      {isAddingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-8 rounded-lg w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingBook ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                onClick={() => {
                  setIsAddingBook(false);
                  setEditingBook(null);
                  setFormData(emptyBook);
                }}
                className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {Object.keys(emptyBook).map((field) => (
                  <div key={field}>
                    <label className="block mb-2 font-medium text-gray-700 capitalize">
                      {field.replace("_", " ")}
                    </label>
                    {field === "summary" ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        placeholder={placeholders[field]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none h-32"
                        required
                      />
                    ) : (
                      <input
                        type={
                          field.includes("count") || field.includes("year")
                            ? "number"
                            : "text"
                        }
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        placeholder={placeholders[field]}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingBook(false);
                    setEditingBook(null);
                    setFormData(emptyBook);
                  }}
                  className="px-4 py-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <div
            key={book._id}
            className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
              <Book size={24} className="text-blue-500" />
              {book.title}
            </h3>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-600">
                <User size={18} className="text-gray-400" />
                <span className="font-medium">Author:</span> {book.author}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Hash size={18} className="text-gray-400" />
                <span className="font-medium">Genre:</span> {book.genre}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Languages size={18} className="text-gray-400" />
                <span className="font-medium">Language:</span> {book.language}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Book size={18} className="text-gray-400" />
                <span className="font-medium">Pages:</span> {book.page_count}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} className="text-gray-400" />
                <span className="font-medium">Published:</span>{" "}
                {book.published_year}
              </p>
              <p className="text-sm text-gray-600 mt-4 border-t pt-4">
                {book.summary}
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => handleEdit(book)}
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit2 size={16} />
                Edit
              </button>
              <button
                onClick={() => {
                  setBookToDelete(book);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default BookApp;
