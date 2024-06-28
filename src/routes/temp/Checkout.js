// src/components/Checkout.js
import React, { useContext } from 'react';
import { ShopContext } from './ShopContext';

const Checkout = () => {
    const { cart, removeItemFromCart } = useContext(ShopContext);

    return (
        <div>
            <h2>Checkout</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        {item.name} - {item.price} - Quantity: {item.quantity}
                        <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <strong>Total: {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</strong>
        </div>
    );
};

export default Checkout;
