import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSell } from '../contexts/SellContext';

const SellClients = ({ clients }) => {
  const { setClient } = useSell();

  return (
    <div className="seller-clients">
      {clients.map((client) => (
        <Link
          key={client._id}
          className="seller-client-item"
          to={`/seller/sell/client/${client._id}`}
          onClick={() => {setClient(client)}}
        >
          <div className="card-body">
            <h5 className="card-title">{client.name}</h5>
            <p className="card-text">ICE: {client.ICE}</p>
            <p className="card-text">Plafon: {client.plafon}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SellClients;
