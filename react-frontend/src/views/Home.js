import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config/config';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to the Admin Dashboard</h1>
      <Link to={`${config.baseUrl}/categories`}>Categories</Link>
      <Link to={`${config.baseUrl}/clients`}>Clients</Link>
    </div>
  );
};

export default Home;
