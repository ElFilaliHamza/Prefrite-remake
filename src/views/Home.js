import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config/config';
import '../assets/css/main.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to the Admin Dashboard</h1>
      <Link to={`${config.Base_URL}/categories`}>Categories</Link>
      <Link to={`${config.Base_URL}/clients`}>Clients</Link>
    </div>
  );
};

export default Home;
