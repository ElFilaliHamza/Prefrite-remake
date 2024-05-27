import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCategory } from '../../api/categoriesApi';
import './AddCategory.css'; // Custom CSS for styling

const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await addCategory(name);
      if (response.ok) {
        navigate('/superadmin/categories'); // Redirect to categories page after successful addition
      } else {
        setError('An error occurred while adding the category.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="add-category-container">
      <h1>Ajouter une categorie</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Creer</button>
      </form>
    </div>
  );
};

export default AddCategory;
