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
  const [showModal, setShowModal] = useState(false); // State for modal visibility
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
      await fetchArticle();
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
    <div className="app-container">
      <div className="simple-container">
        <div className="article-page">
          {article.qtStocke <= article.qtAlerte && (
            <div className="article-alert-message">
              Quantité d'Alerte Atteinte
            </div>
          )}
          <div className="article-controls">
            <div
              className="article-control article-modify"
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className="fas fa-pen"></i>
            </div>
            {isEditing ? (
              <div
                className="article-control article-remove"
                onClick={() => setIsEditing(false)}
              >
                <i className="fas fa-times"></i>
              </div>
            ) : (
              <div
                className="article-control article-remove"
                onClick={() => setShowModal(true)} // Show modal on delete click
              >
                <i className="fas fa-trash"></i>
              </div>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={handleSave} className="article-form">
              <div className="article-form-input">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="article-form-input">
                <input
                  type="number"
                  name="prixVente"
                  placeholder="Prix de Vente"
                  value={formData.prixVente}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="article-form-input">
                <input
                  type="number"
                  name="prixAchat"
                  placeholder="Prix d'achat"
                  value={formData.prixAchat}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="article-form-input">
                <label>Quantité Stockée: {article.qtStocke}</label>
                <input
                  type="number"
                  name="toAddToStock"
                  placeholder="Ajouter au stock"
                  value={formData.toAddToStock}
                  onChange={handleChange}
                />
              </div>
              <div className="article-form-input">
                <input
                  type="number"
                  name="qtAlerte"
                  placeholder="Qt Alerte"
                  value={formData.qtAlerte}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="article-form-input">
                <input type="file" name="image" onChange={handleFileChange} />
              </div>
              <button type="submit" className="submit-btn">
                Sauvegarder
              </button>
            </form>
          ) : (
            <div className="article-details">
              <div className="article-name">{article.name}</div>
              <div className="article-img">
                {article.img ? (
                  <img src={article.img} alt={article.name} />
                ) : (
                  <div className="notfound-img">
                    <i className="fad fa-images"></i>
                  </div>
                )}
              </div>
              <div className="details-container">
                <div className="article-detail">
                  <div>Quantité Stockée: </div>
                  <div>{article.qtStocke}</div>
                </div>
                <div className="article-detail">
                  <div>Quantité d'alerte: </div>
                  <div>{article.qtAlerte}</div>
                </div>
                <div className="article-detail">
                  <div>Prix Vente: </div>
                  <div>{article.prixVente}</div>
                </div>
                <div className="article-detail">
                  <div>Prix Achat: </div>
                  <div>{article.prixAchat}</div>
                </div>
                <div className="article-detail">
                  <div>Commission: </div>
                  <div>{article.commission}</div>
                </div>
              </div>
            </div>
          )}
          <button
            className="flat-btn-small flat-btn-center btn-blue"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory
              ? "Masquer Historique de Stocke"
              : "Historique de Stocke"}
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
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-message">Supprimer {article.name}?</div>
          <div className="modal-btn-group">
            <div className="flat-btn btn-red" onClick={handleDelete}>
              Oui
            </div>
            <div
              className="flat-btn btn-blue"
              onClick={() => setShowModal(false)}
            >
              Non
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
