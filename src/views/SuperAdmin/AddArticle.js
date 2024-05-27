import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { addArticle } from '../../api/articlesApi';
import './AddArticle.css'; // Custom CSS for styling

const AddArticle = () => {
  const [name, setName] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [qtStocke, setQtStocke] = useState('');
  const [qtAlerte, setQtAlerte] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const catId = new URLSearchParams(location.search).get('catId'); // Assume catId is passed in the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!catId || !name || isNaN(prixVente) || isNaN(prixAchat) || isNaN(qtStocke) || isNaN(qtAlerte)) {
      setError('Please fill out all fields correctly.');
      return;
    }

    const formData = new FormData();
    console.log("catId"+catId);
    formData.append('catId', catId);
    formData.append('name', name);
    formData.append('prixVente', prixVente);
    formData.append('prixAchat', prixAchat);
    formData.append('qtStocke', qtStocke);
    formData.append('qtAlerte', qtAlerte);
    if (image) {
      formData.append('file', image);
    }

    try {
      const response = await addArticle(formData);
      if (response.ok) {
        navigate(`/superadmin/category/${catId}`); // Redirect to category detail page after successful addition
      } else {
        setError(`An error occurred: ${response.error}`);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="add-article-container">
      <h1>Ajouter un article</h1>
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
        <div className="form-group">
          <label htmlFor="prixVente">Prix de Vente:</label>
          <input
            type="number"
            id="prixVente"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prixAchat">Prix d'achat:</label>
          <input
            type="number"
            id="prixAchat"
            value={prixAchat}
            onChange={(e) => setPrixAchat(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="qtStocke">Qt Stocke:</label>
          <input
            type="number"
            id="qtStocke"
            value={qtStocke}
            onChange={(e) => setQtStocke(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="qtAlerte">Qt Alerte:</label>
          <input
            type="number"
            id="qtAlerte"
            value={qtAlerte}
            onChange={(e) => setQtAlerte(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className="submit-btn">Creer</button>
      </form>
    </div>
  );
};

export default AddArticle;
