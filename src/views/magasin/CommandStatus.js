import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import '../../assets/css/Styles/Styles.css'; // Assuming your CSS file path
import { formatNumber } from '../../tools/global';

const CommandStatus = ({route}) => {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [startTime, setStartTime] = useState('2024-06-11');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await api.post('/magasin/cmd/getStatus', { startTime, endTime });
                if (response.data.ok) {
                    setArticles(response.data.articles);
                    setStartTime(response.data.startTime);
                    setEndTime(response.data.endTime);
                } else {
                    console.error('Error fetching status data');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching status data:', error);
                setLoading(false);
            }
        };

        fetchStatus();
    }, [startTime, endTime]);

    const handlePrint = () => {
        window.print();
    };

    const total = articles.reduce((acc, article) => acc + (article.qt * article.prixVente), 0);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app-container">
            <div className="simple-container">
                <div>
                    <span>Debut:</span>
                    <input type="date" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                    <span>Fin:</span>
                    <input type="date" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <div>
                    <div className="flat-btn-small flat-btn-center btn-blue" onClick={handlePrint}>Imprimer</div>
                    <div style={{ margin: '20px' }}>
                        <div className="printable-title">Commandes Validées</div>
                        <div className="time-interval-message">{startTime}</div>
                        <table className="simple-table">
                            <thead>
                                <tr>
                                    <th>Article</th>
                                    <th>Qte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map(article => (
                                    <tr key={article._id}>
                                        <td>{article.name}</td>
                                        <td>{formatNumber(article.qt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tbody>
                                <tr>
                                    <td>Total:</td>
                                    <td>{formatNumber(total)} DHS</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandStatus;
