    // src/context/ShopContext.js
    import React, { createContext, useState, useMemo } from 'react';

    export const ShopContext = createContext();

    export const ShopProvider = ({ children }) => {
        const [cart, setCart] = useState([]);
        const [selectedClient, setSelectedClient] = useState(null);
        const [selectedCategory, setSelectedCategory] = useState(null);

        const addItemToCart = (item, quantity) => {
            setCart([...cart, { ...item, quantity }]);
        };

        const removeItemFromCart = (id) => {
            setCart(cart.filter(item => item.id !== id));
        };

        const value = useMemo(() => ({
            cart,
            selectedClient,
            selectedCategory,
            setSelectedClient,
            setSelectedCategory,
            addItemToCart,
            removeItemFromCart,
        }), [cart, selectedClient, selectedCategory]);

        return (
            <ShopContext.Provider value={value}>
                {children}
            </ShopContext.Provider>
        );
    };
