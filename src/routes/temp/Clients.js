// src/components/Clients.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from './ShopContext';

const clients = [
    { id: 1, name: 'Client 1' },
    { id: 2, name: 'Client 2' },
    // Add more clients as needed
];

const Clients = () => {
    const { setSelectedClient } = useContext(ShopContext);
    const navigate = useNavigate();

    const chooseClient = (client) => {
        setSelectedClient(client);
        navigate('/seller/shop/categories');
    };

    return (
        <div>
            <h2>Select a Client</h2>
            <ul>
                {clients.map(client => (
                    <li key={client.id}>
                        <button onClick={() => chooseClient(client)}>
                            {client.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Clients;
