import axios from 'axios';

export const login = async (credentials) => {
  const response = await axios.post('/api/User/login', credentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
