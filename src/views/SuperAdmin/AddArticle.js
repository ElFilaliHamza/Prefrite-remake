import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addArticle } from "../../api/articlesApi";

const AddArticle = () => {
  const [name, setName] = useState("");
  const [prixVente, setPrixVente] = useState("");
  const [prixAchat, setPrixAchat] = useState("");
  const [qtStocke, setQtStocke] = useState("");
  const [qtAlerte, setQtAlerte] = useState("");
  const [commission, setCommission] = useState(""); // Add commission state
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { catId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !catId ||
      !name ||
      isNaN(prixVente) ||
      isNaN(prixAchat) ||
      isNaN(qtStocke) ||
      isNaN(qtAlerte) ||
      isNaN(commission)
    ) {
      setError("Please fill out all fields correctly.");
      return;
    }

    const formData = new FormData();
    formData.append("catId", catId);
    formData.append("name", name);
    formData.append("prixVente", prixVente);
    formData.append("prixAchat", prixAchat);
    formData.append("qtStocke", qtStocke);
    formData.append("qtAlerte", qtAlerte);
    formData.append("commission", commission); // Append commission to form data
    if (image) {
      formData.append("file", image);
    }

    try {
      const response = await addArticle(formData);
      if (response.ok) {
        navigate(`/superadmin/category/${catId}`); // Redirect to category detail page after successful addition
      } else {
        setError(`An error occurred: ${response.error}`);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  if (error) {
    return <div className="error">{error}</div>;
  }
  return (
    <div className="app-container">
      <div className="simple-container">
        <div className="add-page">
          <form className="add-form" onSubmit={handleSubmit}>
            <div className="appTitle">Ajouter un article</div>
            <div className="appInput">
              <input
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="appInput">
              <input
                placeholder="Prix de Vente"
                type="number"
                step="any"
                value={prixVente}
                onChange={(e) => setPrixVente(e.target.value)}
                required
              />
            </div>
            <div className="appInput">
              <input
                placeholder="Prix d'achat"
                type="number"
                step="any"
                value={prixAchat}
                onChange={(e) => setPrixAchat(e.target.value)}
                required
              />
            </div>
            <div className="appInput">
              <input
                placeholder="Qt Stocke"
                type="number"
                step="any"
                value={qtStocke}
                onChange={(e) => setQtStocke(e.target.value)}
                required
              />
            </div>
            <div className="appInput">
              <input
                placeholder="Qt Alerte"
                type="number"
                step="any"
                value={qtAlerte}
                onChange={(e) => setQtAlerte(e.target.value)}
                required
              />
            </div>
            <div className="appInput">
              <input
                placeholder="Commission"
                type="number"
                step="any"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                required
              />
            </div>
            <label tabIndex="0">
              <div className="img-btn">
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <i className="fas fa-image"></i>
                <div>Image</div>
              </div>
            </label>
            <div className="file-upload-progress"></div>
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

export default AddArticle;
