import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Besin ID'ye göre besin bilgilerini getirir
export const getFoodById = async (id) => {
    try {
        const response = await axios.get(`${apiUrl}Food/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching food by ID:', error);
        throw error;
    }
};

export const getUserMealsByUserId = async (userId) => {
    try {
        const response = await axios.get(`${apiUrl}UserMealRecord/today/${userId}`);
        console.log("UserMeal",response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user meals:', error);
        throw error;
    }
};

// Kullanıcı besin kaydını oluşturur
export const createUserMealRecord = async (userMealRecord) => {
    try {
        const response = await axios.post(`${apiUrl}UserMealRecord`, userMealRecord);
        return response.data;
    } catch (error) {
        console.error('Error creating user meal record:', error);
        throw error;
    }
};
