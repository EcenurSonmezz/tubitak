/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import RecipeForm from '../../components/RecipeForm';
import RecipeDisplay from '../../components/RecipeDisplay';
import { LoginContext } from "../../state/context";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Recipe.css';
import background from "../../assets/yapazeka.png"; 

export function Recipe() {
  const [recipe, setRecipe] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); 
  const { id } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (id === "0") {
      toast.error("Lütfen önce giriş yapın", {
        onClose: () => navigate('/login')
      });
    } else {
      fetchUserData(); 
    }
  }, [id, navigate]);

  // Kullanıcı verilerini getiren fonksiyon
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/${id}`);
      console.log("Kullanıcı verisi", response.data);
      setUserData(response.data);
    } catch (error) {
      console.error("Kullanıcı verileri alınırken hata oluştu:", error);
      toast.error("Kullanıcı bilgileri alınamadı!");
    }
  };

  const fetchRecipe = async (data) => {
    const prompt = `Malzemeler: ${data.ingredients}
Öğün Türü: ${data.mealType}
Yapılış Süresi: ${data.cookingTime}
Hastalıklar: ${userData?.diseases?.map(d => d.name).join(", ") || "Belirtilmemiş"}
Alerjiler: ${userData?.allergies?.map(a => a.name).join(", ") || "Belirtilmemiş"}
Bu bilgilere göre, hastalık ve alerjilere uygun bir yemek tarifi oluştur. Türkçe cevap ver.`;

    const options = {
      method: 'POST',
      url: 'https://open-ai21.p.rapidapi.com/chatgpt',
      headers: {
        'x-rapidapi-key': '11bfeac787msh5ef7699bc886e13p1c43ddjsn765c688fedb5',
        'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        top_k: 5,
        top_p: 0.9,
        max_tokens: 256,
        web_access: false
      }
    };

    setLoading(true);

    try {
      const response = await axios.request(options);
      console.log('API Yanıtı:', response.data);

      if (response.data.result) {
        setRecipe(response.data.result.trim());
        setError(null);
      } else {
        throw new Error("Yanıt beklenilen formatta değil.");
      }
    } catch (error) {
      console.error('Yemek tarifi alınırken hata oluştu:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (id === "0") {
    return <ToastContainer />;
  }

  return (
    <div className="recipe-page" style={{ backgroundImage: `url(${background})` }}>
      <div className="form-container">
        <h1 className="text-center mb-4">Yemek Tarifi Üretici</h1>
        <div className="form-content">
          <RecipeForm onSubmit={fetchRecipe} />
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
              <p className="loading-text">Tarif oluşturuluyor...</p>
            </div>
          )}
          {error && <p className="error-message text-danger text-center mt-3">Hata: {error}</p>}
          {recipe && <RecipeDisplay recipe={recipe} />}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
