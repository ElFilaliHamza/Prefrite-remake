// src/components/Categories.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from './ShopContext';

const categories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    // Add more categories as needed
];

const Categories = () => {
    const { selectedClient, setSelectedCategory } = useContext(ShopContext);
    const navigate = useNavigate();

    if (!selectedClient) {
        navigate('/seller/shop');
        return null;
    }

    const chooseCategory = (category) => {
        setSelectedCategory(category);
        navigate('/seller/shop/articles');
    };

    return (
        <div>
            <h2>Select a Category for {selectedClient.name}</h2>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <button onClick={() => chooseCategory(category)}>
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
