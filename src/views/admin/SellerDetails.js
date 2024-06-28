import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchSellerDetails, fetchMoreArticles, handPayement, updateSellerArticle } from '../../api/adminAPI';
import Loading from '../../components/Loading';
import StatsChart from '../../components/StatsChart';
import { usePrintComponent } from '../../tools/printComponent';
import api from '../../api/api';
import { formatNumber } from '../../tools/global';
import InvoiceContent from '../../components/InvoiceContent';

const SellerDetails = () => {
  const { idSeller } = useParams();
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [skip, setSkip] = useState(0);
  const [payment, setPayment] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editArticleId, setEditArticleId] = useState(null);
  const [editArticleQty, setEditArticleQty] = useState(0);
  const [showPrint, setShowPrint] = useState(false);
  const [, PrintComponent] = usePrintComponent();
  const limit = 10; // Number of articles to fetch per request

  useEffect(() => {
    const getSellerDetails = async () => {
      try {
        const data = await fetchSellerDetails(idSeller);
        setSellerData(data);
        setArticles(data.articles);
        setSkip(data.articles.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seller details:', error);
        setLoading(false);
      }
    };

    getSellerDetails();
  }, [idSeller]);

  const loadMoreArticles = async () => {
    try {
      const response = await fetchMoreArticles({ _id: idSeller, skip, limit });
      const moreArticles = response.articles; // Access the articles array correctly
      if (Array.isArray(moreArticles)) {
        setArticles(prevArticles => [...prevArticles, ...moreArticles]);
        setSkip(prevSkip => prevSkip + moreArticles.length);
      } else {
        console.error('Fetched data is not an array:', moreArticles);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    }
  };

  const handlePaymentChange = (e) => {
    setPayment(e.target.value);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const data = handPayement(idSeller, payment);
      if (data.ok) {
        setSellerData({
          ...sellerData,
          stats: {
            ...sellerData.stats,
            leftToSell: sellerData.stats.leftToSell - parseFloat(payment),
          }
        });
        setShowModal(false);
      } else {
        console.error('Payment error', data);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleCancelPayment = () => {
    setShowModal(false);
  };

  const handleEditArticleClick = (articleId) => {
    setEditArticleId(articleId);
  };

  const handleArticleQtyChange = (e) => {
    setEditArticleQty(e.target.value);
  };

  const handleArticleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateSellerArticle(idSeller, editArticleId, editArticleQty);
      if (data.ok) {
        const updatedArticles = articles.map(article =>
          article._id === editArticleId ? { ...article, qt: data.newQtSeller } : article
        );
        setArticles(updatedArticles);
        setEditArticleId(null);
        const statsResponse = await api.post('/admin/vendeurs/getStats', { _id: idSeller });
        if (statsResponse.data) {
          setSellerData({
            ...sellerData,
            stats: statsResponse.data
          });
        }
      } else {
        console.error('Article update error', data);
      }
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditArticleId(null);
  };

  const handleShowPrint = () => {
    setShowPrint(true);
  };

  const handleHidePrint = () => {
    setShowPrint(false);
  };

  if (loading) {
    return <Loading />;
  }

  if (!sellerData) {
    return <div>No seller data found.</div>;
  }

  const { vendeur, clients, stats } = sellerData;

  return (
    <div className="app-container">
      <div className="user-home">
        <div className="simple-container">
          <div className="path-nav">
            <a className="path-btn" href="/admin"><i className="fas fa-home"></i></a>
            <a className="path-nav-item" href="/admin/vendeurs">Vendeurs</a>
          </div>
          <div className="user-vendeur">
            <div className="user-vendeur-child">
              <div className="vendeur-articles user-vendeur-item">
                <Link className="art-add"><span>Articles</span></Link>
                {articles.length > 0 && (
                  <>
                    <table className="modern-table">
                      <tbody>
                        <tr>
                          <th>Nom</th>
                          <th>Quantite</th>
                          <th>Action</th>
                        </tr>
                        {articles.map(article => (
                          <tr key={article._id}>
                            {editArticleId === article._id ? (
                              <td colSpan="2">
                                <div className="vendeur-art-edit">
                                  <form className="vendeur-art-edit" onSubmit={handleArticleEditSubmit}>
                                    {article.name}&nbsp;-&nbsp;
                                    <input
                                      type="number"
                                      step="any"
                                      className="art-input"
                                      value={editArticleQty}
                                      onChange={handleArticleQtyChange}
                                    />
                                    <label className="icon icon-success">
                                      <i className="fas fa-check"></i>
                                      <input type="submit" hidden />
                                    </label>
                                    <div className="icon icon-danger" onClick={handleCancelEdit}>
                                      <i className="fas fa-times"></i>
                                    </div>
                                  </form>
                                </div>
                              </td>
                            ) : (
                              <>
                                <td><div className="vendeur-article-card-name">{article.name}</div></td>
                                <td><div className="vendeur-art-edit">{article.qt}</div></td>
                                <td>
                                  <div className="vendeur-article-remove" onClick={() => handleEditArticleClick(article._id)}>
                                    <i className="fas fa-minus"></i>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="flat-btn-small btn-blue show-more-btn" onClick={loadMoreArticles}>Afficher plus</div>
                    <div className="flat-btn-small flat-btn-center btn-blue" onClick={handleShowPrint}>Imprimer <i className="far fa-print"></i></div>
                  </>
                )}
              </div>
              <div className="user-vendeur-item">
                <a className="art-add" href={`/admin/addClient/${vendeur._id}`}><span>Clients</span><i className="fas fa-plus"></i></a>
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th>ICE</th>
                      <th>Nom</th>
                      <th>Plafond</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client._id}>
                        <td><a href={`/admin/client/${client._id}`}>{client.ice}</a></td>
                        <td><a href={`/admin/client/${client._id}`}>{client.name}</a></td>
                        <td><a href={`/admin/client/${client._id}`}>{client.plafon}</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="user-vendeur-child">
              <div className="user-vendeur-item">
                <div className="art-add">Etat</div>
                <div className="stats-container">
                  <h3>Total: {formatNumber(stats.credit + stats.paid + stats.leftToSell)} DHS</h3>
                  <StatsChart stats={stats} /> {/* Add the StatsChart component here */}
                </div>
              </div>
              {stats.sold - stats.credit > 0 && (
                <div className="user-vendeur-item">
                  <div className="art-add">Payment</div>
                  <form className="vendeur-hand-payment" onSubmit={handleSubmitPayment}>
                    <div className="inputContainer">
                      <input placeholder="Payer" className="input" value={formatNumber(stats.sold)} onChange={handlePaymentChange} />
                      <label>
                        <div tabIndex="1" className="input-btn"><i className="fas fa-thumbs-up"></i></div>
                        <input type="submit" hidden />
                      </label>
                    </div>
                  </form>
                  {showModal && (
                    <div className="modal">
                      <div className="modal-message">Payer {formatNumber(stats.sold)} DHS Pour {vendeur.name} ?</div>
                      <div className="modal-btn-group">
                        <div className="flat-btn btn-green" onClick={handleConfirmPayment}>Oui</div>
                        <div className="flat-btn btn-red" onClick={handleCancelPayment}>Non</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="user-vendeur-item">
                <div className="art-add">Extra</div>
                <div className="vendeur-extra">
                  <div className="vendeur-extra-item">
                    <div>Nom:</div>
                    <div>{vendeur.name}</div>
                  </div>
                  {/* <div className="vendeur-extra-item">
                    <div>Username:</div>
                    <div>{vendeur.username}</div>
                  </div>
                  <div className="vendeur-extra-item">
                    <div>Password:</div>
                    <div>{vendeur.password}</div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPrint && (
        <div className="art-adding">
          <div className="print-modal">
            <div className="modal-nav">
              <div className="close-modal" onClick={handleHidePrint}><i className="fas fa-times"></i></div>
            </div>
            <PrintComponent>
              <InvoiceContent sellerData={sellerData} />
            </PrintComponent>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDetails;
