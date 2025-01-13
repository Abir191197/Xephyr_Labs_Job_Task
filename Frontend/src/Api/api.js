import axios from 'axios';

const BASE_URL = 'https://xephyr-labs-job-task-backend.vercel.app';

// Create Book API
export const addBook = async (bookData) => {
    try {
        const response = await axios.post(`${BASE_URL}/Books`, bookData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding book:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to add book');
    }
};

// Fetch All Books API
export const fetchBook = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/Books`);
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch books');
    }
};

// Delete Book API 
export const deleteBook = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Books/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting book:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete book');
    }
};

// Update Book API
export const updateBook = async (id, updatedData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Books/${id}`, updatedData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating book:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update book');
    }
};
