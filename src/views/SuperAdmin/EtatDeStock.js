import React, { useState, useEffect } from "react";
import { fetchArticles } from "../../api/articlesApi";
import { usePrintComponent } from "../../tools/printComponent";
import "../../assets/css/Styles/EtatDeStock.css"; // Custom CSS for styling
import Loading from "../../components/Loading";
import PathNav from "../../components/PathNav";

const EtatDeStock = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalVente: 0,
    totalAchat: 0,
    benefice: 0,
  });
  const [handlePrint, PrintComponent] = usePrintComponent();
  const navItems = [
    { path: '/superadmin', label: '', isHome: true , isCurr: true},
  ];
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        setArticles(data);
        calculateTotals(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const calculateTotals = (articles) => {
    let totalVente = 0;
    let totalAchat = 0;
    articles.forEach((article) => {
      totalVente += article.qtStocke * article.prixVente;
      totalAchat += article.qtStocke * article.prixAchat;
    });
    const benefice = totalVente - totalAchat;
    setTotals({ totalVente, totalAchat, benefice });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="alerts-container">
      <PathNav navItems={navItems} />
      <button className="print-btn" onClick={handlePrint}>
        Imprimer
      </button>
      <PrintComponent>
        <h1>Stocke Local</h1>
        <table className="alerts-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Qte</th>
              <th>P A</th>
              <th>P V</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td>{article.name}</td>
                <td>{article.qtStocke}</td>
                <td>{article.prixAchat}</td>
                <td>{article.prixVente}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3">
                <strong>Total Vente</strong>
              </td>
              <td>{totals.totalVente.toFixed(2)} DHS</td>
            </tr>
            <tr>
              <td>
                <strong>Total Achat</strong>
              </td>
              <td></td>
              <td>{totals.totalAchat.toFixed(2)} DHS</td>
              <td></td>
            </tr>
            <tr>
              <td colSpan="3">
                <strong>Benefice</strong>
              </td>
              <td>{totals.benefice.toFixed(2)} DHS</td>
            </tr>
          </tbody>
        </table>
      </PrintComponent>
    </div>
  );
};

export default EtatDeStock;
