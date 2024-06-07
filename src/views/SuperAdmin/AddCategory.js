import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCategory } from '../../api/categoriesApi';
// import '../../assets/css/Styles/AddCategory.css'; // Custom CSS for styling

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
    <div className="app-container">
      <div className="user-nav">
        <div className="user-nav-item">
          <a className="user-name-title" href="/superadmin">Super Admin</a>
        </div>
        <div className="user-nav-item btn-group-around">
          <div className="refresh-btn" tabIndex="0">
            <i className="fas fa-sync"></i>
          </div>
          <div className="refresh-btn" tabIndex="0" style={{ margin: '5px 10px' }}>
            <i className="fas fa-adjust"></i>
          </div>
          <div className="Btn logoutBtn refresh-btn">
            <i className="fas fa-sign-out"></i>
          </div>
        </div>
      </div>
      <div className="simple-container">
        <div className="path-nav">
          <a className="path-btn" href="/superadmin">
            <i className="fas fa-home"></i>
          </a>
          <a className="path-btn" href="/superadmin/categories">
            <i className="fas fa-list"></i>
          </a>
          <a className="path-nav-item" href="/superadmin/category/63d5803661e84f6667aa91be">
            Categorie Correspondante
          </a>
        </div>
        <div className="add-page">
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="appTitle">Ajouter une categorie</div>
            <div className="appInput">
              <input 
                placeholder="Nom"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <label tabIndex="0" className="submit-btn">
              <input type="submit" hidden />
              Creer
            </label>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default AddCategory;
