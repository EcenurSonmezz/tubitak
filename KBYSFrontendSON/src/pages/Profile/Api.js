import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Kullanıcı profili verisini çekme
export const getUserProfile = async (userId) => {
  const response = await axios.get(`${apiUrl}user/${userId}`);
  console.log("UserProfile", response.data);
  return response.data;
};

// Alerji seçeneklerini çekme
export const getAllergyOptions = async (query = '') => {
  const response = await axios.get(`${apiUrl}Allergies/Search/search?query=${query}`);
  console.log("getAllergyOptions", response.data);
  return response.data || [];
};

// Kullanıcı bilgilerini güncelleme
export const updateUserProfile = async (userId, editInfo) => {
  const response = await axios.put(`${apiUrl}user/${userId}`, editInfo);
  return response.data;
};

// Kullanıcı alerjilerini kaydetme
export const saveUserAllergies = async (userId, allergyIds) => {
  const payload = { UserId: userId, AllergyIds: allergyIds };
  const response = await axios.post(`${apiUrl}Userallergies/Add`, payload);
  return response.data;
};

// Hastalık seçeneklerini çekme
export const getDiseaseOptions = async (query = '') => {
  const response = await axios.get(`${apiUrl}Diseases/Search?query=${query}`);
  console.log("getDiseaseOptions", response.data);
  return response.data || [];
};

// Kullanıcı hastalıklarını kaydetme
export const saveUserDiseases = async (userId, diseaseIds) => {
  const payload = { UserId: userId, DiseaseIds: diseaseIds };
  const response = await axios.post(`${apiUrl}User/AddUserDiseases`, payload);
  return response.data;
};
