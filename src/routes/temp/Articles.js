// src/components/Articles.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from './ShopContext';

const articles = [
    { id: 1, name: 'Article 1', price: 10, stock: 100 },
    { id: 2, name: 'Article 2', price: 20, stock: 50 },
    // Add more articles as needed
];

const Articles = () => {
    const { selectedCategory, addItemToCart } = useContext(ShopContext);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    if (!selectedCategory) {
        navigate('/seller/shop');
        return null;
    }

    const handleQuantityChange = (articleId, quantity) => {
        setQuantities({
            ...quantities,
            [articleId]: quantity
        });
    };

    const addToCart = (article) => {
        const quantity = quantities[article.id] || 0;
        addItemToCart(article, quantity);
    };

    return (
        <div>
            <h2>Articles in {selectedCategory.name}</h2>
            <ul>
                {articles.map(article => (
                    <li key={article.id}>
                        {article.name} - {article.price} - Stock: {article.stock}
                        <input
                            type="number"
                            value={quantities[article.id] || ''}
                            onChange={(e) => handleQuantityChange(article.id, e.target.value)}
                        />
                        <button onClick={() => addToCart(article)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate('/seller/shop/checkout')}>Checkout</button>
        </div>
    );
};

export default Articles;
