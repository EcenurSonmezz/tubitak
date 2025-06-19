import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const login = async (credentials) => {
  const response = await axios.post(`${apiUrl}User/login`, credentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
