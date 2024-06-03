import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../assets/css/Styles/Sell.css';

const SellArticles = ({ sellerData }) => {
  const { idCat } = useParams();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const cat = sellerData.artsNcats.cats.find((cat) => cat._id === idCat);

  useEffect(() => {
    if (sellerData && sellerData.artsNcats && sellerData.artsNcats.arts) {
      const filteredArticles = sellerData.artsNcats.arts.filter(article => article.catId === idCat);
      setArticles(filteredArticles);
    }
  }, [idCat, sellerData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredArticles = articles.filter(article =>
    article.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="content">
        <div className="content__inner">
          <div className="Container">
            <div className="multisteps-form">
              <div className="row switch-pane" style={{ marginBottom: '10px' }}>
                <div className="col-12 col-lg-8 ml-auto mr-auto m">
                  <div className="multisteps-form__progress">
                    <button className="multisteps-form__progress-btn js-active" type="button">Clients</button>
                    <button className="multisteps-form__progress-btn js-active" type="button">Choisissez une catégorie</button>
                    <button className="multisteps-form__progress-btn js-active" type="button">Choisir un article</button>
                    <button className="multisteps-form__progress-btn" type="button">Payer</button>
                    <button className="multisteps-form__progress-btn" type="button">Facture d'achat</button>
                  </div>
                </div>
              </div>
              <h3 style={{ textAlign: 'center', margin: '10px auto', textDecoration: 'underline' }}>
                Articles de la catégorie {cat.name}
              </h3>
              <div className="md-form mt-0">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Rechercher"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Qt Disp</th>
                    <th>Qte</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map(article => (
                    <tr key={article._id}>
                      <td>{article.name}</td>
                      <td>{article.qtStocke}</td>
                      <td><input className="form-control" type="number" step="any" /></td>
                      <td>{article.prixVente} DHS</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td><strong>Total: </strong></td>
                    <td><strong>0 DHS</strong></td>
                  </tr>
                </tbody>
              </table>
              <div className="button-row d-flex mt-4">
                <button className="flat-btn-small btn-red">Annuler</button>
                <button className="ml-auto flat-btn-small btn-blue">Suivant</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellArticles;
