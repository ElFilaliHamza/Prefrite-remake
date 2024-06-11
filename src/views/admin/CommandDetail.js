import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { fetchAdminCommand } from '../../api/adminAPI';

const CommandDetail = () => {
    const { commandId } = useParams();
    const [loading, setLoading] = useState(true);
    const [command, setCommand] = useState(null);

    useEffect(() => {
        const fetchCommand = async () => {
            try {
                const data = await fetchAdminCommand(commandId);
                if (data.error) {
                    console.error('Error fetching command data:', data);
                } else {
                    setCommand(data.cmd);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching command data:', error);
                setLoading(false);
            }
        };

        fetchCommand();
    }, [commandId]);

    if (loading) {
        return <Loading />;
    }

    if (!command) {
        return <div>No command data found.</div>;
    }

    const { _id, sellerInfo, articles, time } = command;

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div className="path-nav">
                        <a className="path-btn" href="/admin"><i className="fas fa-home"></i></a>
                        <a className="path-nav-item" href="/admin/commands">Commandes</a>
                    </div>
                    <div className="flat-btn-small flat-btn-center btn-blue" onClick={() => window.print()}>Imprimer</div>
                    <div>
                        <div className="printable-title">Commande de {sellerInfo.name}</div>
                        <div style={{ textAlign: 'center' }}>{_id}</div>
                        <div className="time-interval-message">{new Date(time).toLocaleString()}</div>
                        <table className="cmd-art-table">
                            <thead>
                                <tr className="cmd-lastLine">
                                    <th colSpan="2">Article</th>
                                    <th>Qt Disp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map(article => (
                                    <React.Fragment key={article._id}>
                                        <tr>
                                            <td colSpan="2">{article.name}</td>
                                            <td>{article.qtStocke}</td>
                                        </tr>
                                        <tr className="cmd-lastLine">
                                            <td>Qte: {article.qt}</td>
                                            <td>Prix: {article.prixVente} DHS</td>
                                            <td>{article.qt * article.prixVente} DHS</td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                            <tbody>
                                <tr>
                                    <td colSpan="2">Total:</td>
                                    <td>{articles.reduce((total, article) => total + (article.qt * article.prixVente), 0)} DHS</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommandDetail;
