import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import '../../assets/css/Styles/Styles.css'; // Assuming your CSS file path

const StockStatus = () => {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const response = await api.post('/magasin/stock/get');
                if (response.data.ok) {
                    setArticles(response.data.articles);
                } else {
                    console.error('Error fetching stock data');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stock data:', error);
                setLoading(false);
            }
        };

        fetchStock();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app-container">
            <div className="simple-container">
                <div>
                    <div className="flat-btn-small flat-btn-center btn-blue" onClick={handlePrint}>Imprimer</div>
                    <div style={{ margin: '20px' }}>
                        <div className="printable-title">Stocke Local</div>
                        <div className="time-interval-message">{new Date().toLocaleString()}</div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Article</th>
                                    <th>Quantité</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map(article => (
                                    <tr key={article._id}>
                                        <td>{article.name}</td>
                                        <td>{article.qtStocke.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockStatus;
