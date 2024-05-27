import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../../api/categoriesApi';
import './Categories.css'; // Custom CSS for styling

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [skip, setSkip] = useState(0);
  const [endCats, setEndCats] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories(skip);
      setCategories(prevCategories => [...prevCategories, ...data.array]);
      setEndCats(data.endCats);
      setSkip(prevSkip => prevSkip + data.array.length);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="categories-container">
      <h1>Super Admin</h1>
      <Link to="/superadmin" className="home-link">
        <i className="fas fa-home"></i>
      </Link>
      <div className="card-container">
        <Link to="/superadmin/addCategory" className="category-card add-card">
          <div className="card-icon"><i className="fas fa-plus"></i></div>
        </Link>
        {categories.map(category => (
          <Link to={`/superadmin/category/${category._id}`} key={category._id} className="category-card">
            <div className="card-icon"><i className="fas fa-folder"></i></div>
            <div className="card-title">{category.name}</div>
          </Link>
        ))}
      </div>
      {!endCats && (
        <button onClick={loadCategories} className="load-more-btn">Load More</button>
      )}
    </div>
  );
};

export default Categories;
