import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  getStockHistory,
} from "../../api/articlesApi";
import "../../assets/css/Styles/ArticleDetail.css"; // Custom CSS for styling
import defaultSVG from "../../assets/images/default_article.svg";

const ArticleDetail = () => {
  const { idArt } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    prixVente: "",
    prixAchat: "",
    qtAlerte: "",
    image: null,
    toAddToStock: 0,
  });
  const [stockHistory, setStockHistory] = useState([]);
  const [endHistory, setEndHistory] = useState(false);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    fetchArticle();
    fetchStockHistory(0); // Reset skip value when component mounts or idArt changes
  }, [idArt]);

  const fetchArticle = async () => {
    try {
      const data = await getArticle(idArt);
      setArticle(data);
      setFormData({
        name: data.name,
        prixVente: data.prixVente,
        prixAchat: data.prixAchat,
        qtAlerte: data.qtAlerte,
        image: null,
        toAddToStock: 0,
      });
    } catch (error) {
      console.error("Error fetching article:", error);
    }
  };

  const fetchStockHistory = async (newSkip) => {
    try {
      const data = await getStockHistory(idArt, newSkip);
      if (newSkip === 0) {
        setStockHistory(data.stockHistory);
      } else {
        setStockHistory((prevHistory) => [
          ...prevHistory,
          ...data.stockHistory,
        ]);
      }
      setEndHistory(data.endHistory);
      setSkip(newSkip + data.stockHistory.length);
    } catch (error) {
      console.error("Error fetching stock history:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateArticle(idArt, formData);
      setIsEditing(false);
      fetchArticle();
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(idArt);
      navigate("/superadmin/categories");
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  return (
    <div className="article-detail-container">
      <div className="header">
        <div className="back-link-container">
          <Link
            to={`/superadmin/category/${article.catId}`}
            className="back-link"
          >
            <i className="fas fa-home"></i> Categorie Correspondante
          </Link>
        </div>
        <h1 className="article-title">{article.name}</h1>
        {article.qtStocke <= article.qtAlerte && (
          <div className="alert-quantity">Quantité d'Alerte Atteinte</div>
        )}
        <div className="actions">
          <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
            <i className="fas fa-pencil-alt"></i>
          </button>
          <button onClick={handleDelete} className="delete-btn">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="article-form">
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="prixVente"
            placeholder="Prix de Vente"
            value={formData.prixVente}
            onChange={handleChange}
          />
          <input
            type="number"
            name="prixAchat"
            placeholder="Prix d'achat"
            value={formData.prixAchat}
            onChange={handleChange}
          />
          <div className="stock-container">
            <label>Quantité Stockée: {article.qtStocke}</label>
            <input
              type="number"
              name="toAddToStock"
              placeholder="Ajouter au stock"
              value={formData.toAddToStock}
              onChange={handleChange}
            />
          </div>
          <input
            type="number"
            name="qtAlerte"
            placeholder="Qt Alerte"
            value={formData.qtAlerte}
            onChange={handleChange}
          />
          <input type="file" name="image" onChange={handleFileChange} />
          <button type="submit">Sauvegarder</button>
        </form>
      ) : (
        <div className="article-info">
          <div className="image-container">
            {article.img ? (
              <img src={article.img} alt={article.name} />
            ) : (
              <img src={defaultSVG} alt="default" />
            )}
          </div>
          <p>
            <strong>Quantité Stockée:</strong> {article.qtStocke}
          </p>
          <p>
            <strong>Quantité d'alerte:</strong> {article.qtAlerte}
          </p>
          <p>
            <strong>Prix Vente:</strong> {article.prixVente}
          </p>
          <p>
            <strong>Prix Achat:</strong> {article.prixAchat}
          </p>
        </div>
      )}
      <button
        className="history-btn"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? "Masquer Historique de Stocke" : "Historique de Stocke"}
      </button>
      {showHistory && (
        <div className="stock-history-container">
          <h2>Historique de Stocke</h2>
          <table className="stock-history-table">
            <thead>
              <tr>
                <th>Article</th>
                <th>Qte</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.artInfo.name}</td>
                  <td>{history.qt}</td>
                  <td>{new Date(history.time).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!endHistory && (
            <button
              onClick={() => fetchStockHistory(skip)}
              className="load-more-btn"
            >
              Afficher Plus
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
