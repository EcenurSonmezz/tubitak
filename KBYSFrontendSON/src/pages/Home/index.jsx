/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import './HomePage.css';
import axios from 'axios';
import { HealthySlider } from '../../components/Slider/HealthySlider';
import { getFoodById, getUserMealsByUserId, createUserMealRecord } from './api';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import deneme from "../../assets/deneme.png";
import deneme2 from "../../assets/deneme2.png";

export function Home() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [userMeals, setUserMeals] = useState([]);
    const [totals, setTotals] = useState({
        protein: 0,
        carbohydrate: 0,
        fat: 0,
        fiber: 0,
        calorie: 0,
    });

    useEffect(() => {
        const loginData = localStorage.getItem('loginData');
        if (loginData) {
            try {
                const userId = JSON.parse(loginData).id;
                fetchUserMeals(userId);
            } catch (error) {
                console.error('Error parsing login data:', error);
                toastr.error('Kullanıcı verileri alınırken bir hata oluştu.');
            }
        } else {
            console.error('No login data found in localStorage');
        }

        if (window.location.pathname === '/meal-cards-container') {
            const mealCardsContainer = document.getElementById('meal-cards-container');
            if (mealCardsContainer) {
                mealCardsContainer.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Scroll animation trigger
        const scrollElements = document.querySelectorAll(".scroll-animation");
        const elementInView = (el, offset = 0) => {
            const elementTop = el.getBoundingClientRect().top;
            return elementTop <= ((window.innerHeight || document.documentElement.clientHeight) - offset);
        };

        const displayScrollElement = (element) => {
            element.classList.add("scrolled");
        };

        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 150)) {
                    displayScrollElement(el);
                }
            });
        };

        window.addEventListener("scroll", handleScrollAnimation);

        // Initial check to trigger animation for elements already in view
        handleScrollAnimation();

        // Cleanup event listener on component unmount
        return () => window.removeEventListener("scroll", handleScrollAnimation);
    }, []);

    useEffect(() => {
        if (userMeals.length > 0) {
            calculateTotals();
        }
    }, [userMeals]);

    const fetchUserMeals = async (userId) => {
        try {
            const meals = await getUserMealsByUserId(userId);
            console.log(meals);
            
            if (meals && Array.isArray(meals)) {
                setUserMeals(meals);
            } else {
                setUserMeals([]);
            }
        } catch (error) {
            console.error('Error fetching user meals:', error);
            toastr.error('Besin verileri alınırken bir hata oluştu.');
        }
    };

    const handleSearch = async (e) => {
        const searchQuery = e.target.value.replace(/\b\w/g, char => char.toUpperCase());
        setQuery(searchQuery);

        if (searchQuery.length >= 1) {
            try {
                const response = await axios.get(`/api/food/search?query=${searchQuery}`);
                console.log("gelen veri:", response.data);

                const foodResults = response.data || [];
                setResults(Array.isArray(foodResults) ? foodResults : []);
            } catch (error) {
                console.error('Error fetching food data:', error);
                toastr.error('Besin arama işlemi sırasında bir hata oluştu.');
            }
        } else {
            setResults([]);
        }
    };

    const handleSelect = async (food) => {
        try {
            const foodDetails = await getFoodById(food.id);
            setSelectedFood(foodDetails);
            setQuery(food.name);
            setResults([]);
        } catch (error) {
            console.error('Error fetching food by ID:', error);
            toastr.error('Besin detayları alınırken bir hata oluştu.');
        }
    };

    const handleSave = async () => {
        const loginData = localStorage.getItem('loginData');
        if (loginData) {
            try {
                const userId = JSON.parse(loginData).id;
                const userMealRecord = {
                    userId: userId,
                    foodId: selectedFood.id,
                    dateConsumed: new Date().toISOString()
                };

                await createUserMealRecord(userMealRecord);
                toastr.success('Besin kaydedildi.');
                fetchUserMeals(userId);
            } catch (error) {
                console.error('Error saving food record:', error);
                toastr.error('Besin kaydedilirken bir hata oluştu.');
            }
        } else {
            console.error('No login data found in localStorage');
            toastr.error('Kullanıcı verileri mevcut değil.');
        }
    };

    const calculateTotals = () => {
        const totals = {
            protein: 0,
            carbohydrate: 0,
            fat: 0,
            fiber: 0,
            calorie: 0,
        };

        userMeals.forEach(meal => {
            if (meal.food && meal.food.nutritionalValues && Array.isArray(meal.food.nutritionalValues)) {
                meal.food.nutritionalValues.forEach(value => {
                    if (value.name.toLowerCase() === 'protein') {
                        totals.protein += value.foodValue;
                    } else if (value.name.toLowerCase() === 'karbonhidrat') {
                        totals.carbohydrate += value.foodValue;
                    } else if (value.name.toLowerCase() === 'yağ') {
                        totals.fat += value.foodValue;
                    } else if (value.name.toLowerCase() === 'lif') {
                        totals.fiber += value.foodValue;
                    } else if (value.name.toLowerCase() === 'kalori') {
                        totals.calorie += value.foodValue;
                    }
                });
            }
        });

        for (let key in totals) {
            totals[key] = parseFloat(totals[key].toFixed(2));
        }

        setTotals(totals);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
    };

    return (
        <div className="homepage-container">
            <div className="hero-section scroll-animation">
                <div className="hero-text scroll-animation">
                    <h1>
                        Kişiselleştirilmiş Beslenme ve Yemek Tarifi Sistemi
                    </h1>
                    <p>Sadece Senin İçin: Kişisel Beslenme ve Tarif Çözümleri</p>

                    <div className="search-section scroll-animation">
                        <form className="search-form scroll-animation">
                            <input
                                type="text"
                                value={query}
                                onChange={handleSearch}
                                placeholder="Besin Arayın..."
                            />
                            {query && (
                                <button type="button" className="clear-button" onClick={handleClear}>
                                    &times;
                                </button>
                            )}
                            <button type="submit" className="search-button"></button>
                            <button type="submit" className="order-now-button">🔍</button>
                        </form>
                        <div className="search-results scroll-animation">
                            {results.map(food => (
                                <div key={food.id} className="food-item scroll-animation" onClick={() => handleSelect(food)}>
                                    <h3>{food.name}</h3>
                                    <p>{food.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hero-image scroll-animation">
                    <img src={deneme} alt="Healthy Food" />
                </div>
            </div>

            <div className="slider-container scroll-animation">
                <HealthySlider />
            </div>
            <br></br>
            <div className="meal-cards-container scroll-animation" id="meal-cards-container">
                <div className="today-meals scroll-animation">
                    <div className="meal-image scroll-animation">
                        <img src={deneme2} alt="Meal Image" />
                    </div>
                    <div className="meal-summary scroll-animation">
                        <h2>Günlük Rapor</h2>
                        <p>Total Protein: {totals.protein} g</p>
                        <p>Total Carbohydrate: {totals.carbohydrate} g</p>
                        <p>Total Fat: {totals.fat} g</p>
                        <p>Total Fiber: {totals.fiber} g</p>
                        <p>Total Calorie: {totals.calorie} kcal</p>
                    </div>
                </div>

                {selectedFood && (
                    <div className="selected-food scroll-animation">
                        <h2>Selected Food</h2>
                        <p>Name: {selectedFood.name}</p>
                        <p>Description: {selectedFood.description}</p>
                        <h3>Nutritional Values:</h3>
                        {selectedFood.nutritionalValues.length === 0 ? (
                            <p>Bu besin için besin değerleri mevcut değil.</p>
                        ) : (
                            <ul>
                                {Array.isArray(selectedFood.nutritionalValues) && selectedFood.nutritionalValues.map((value) => (
                                    <li key={value.id}>{value.name}: {value.foodValue} {value.unit}</li>
                                ))}
                            </ul>
                        )}
                        <button onClick={handleSave}>Save</button>
                    </div>
                )}
            </div>
        </div>
    );
}
