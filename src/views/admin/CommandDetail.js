import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import { fetchRouteCommand } from '../../api/adminAPI';
import config from '../../config/config';
import api from '../../api/api';
import { usePrintComponent } from '../../tools/printComponent';
import { formatNumber } from '../../tools/global';

const CommandDetail = ({ route }) => {
    const { commandId } = useParams();
    const [handlePrint, PrintComponent] = usePrintComponent();
    const [loading, setLoading] = useState(true);
    const [command, setCommand] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchCommand = async () => {
            try {
                const data = await fetchRouteCommand(commandId, route);
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
    }, [commandId,route]);

    const handleRemoveArticle = async () => {
        try {
            const response = await api.post('/magasin/cmd/removeCmdArt', {
                _id: commandId,
                artId: selectedArticle
            });

            if (response.data.ok) {
                setCommand(prevCommand => ({
                    ...prevCommand,
                    articles: prevCommand.articles.filter(article => article._id !== selectedArticle)
                }));
            } else {
                console.error('Error removing article:', response.data);
            }
        } catch (error) {
            console.error('Error removing article:', error);
        } finally {
            setShowModal(false);
            setSelectedArticle(null);
        }
    };

    const handleConfirmCommand = async () => {
        try {
            const response = await api.post('/magasin/cmd/confirmCmd', { _id: commandId });
            if (response.data.ok) {
                alert('Commande confirmée');
            } else {
                console.error('Error confirming command:', response.data);
            }
        } catch (error) {
            console.error('Error confirming command:', error);
        }
    };

    const handleCancelCommand = async () => {
        try {
            const response = await api.post('/magasin/cmd/cancelCmd', { _id: commandId });
            if (response.data.ok) {
                alert('Commande annulée');
            } else {
                console.error('Error canceling command:', response.data);
            }
        } catch (error) {
            console.error('Error canceling command:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!command) {
        return <div>No command data found.</div>;
    }

    const { _id, sellerInfo, articles, time, fullfiled } = command;

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div className="path-nav">
                        <a className="path-btn" href={`/${route}`}><i className="fas fa-home"></i></a>
                        <a className="path-nav-item" href={`${route}/commands`}>Commandes</a>
                    </div>
                    <div className="flat-btn-small flat-btn-center btn-blue" onClick={handlePrint}>Imprimer</div>
                    <div>
                        <PrintComponent>
                            <div className="printable-title">Commande de {sellerInfo.name}</div>
                            <div style={{ textAlign: 'center' }}>{_id}</div>
                            <div className="time-interval-message">{new Date(time).toLocaleString()}</div>
                            <table className="cmd-art-table">
                                <thead>
                                    <tr className="cmd-lastLine">
                                        <th colSpan="2">Article</th>
                                        <th>Qt Disp</th>
                                        {route === config.BASE_ROUTE.MAGASIN && <th>Retirer?</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles.map(article => (
                                        <React.Fragment key={article._id}>
                                            <tr>
                                                <td colSpan="2">{article.name}</td>
                                                <td>{formatNumber(article.qtStocke)}</td>
                                                {route === config.BASE_ROUTE.MAGASIN && (
                                                    <td rowSpan="2" className="cmd-lastLine">
                                                        <div className="flat-btn-small btn-red" onClick={() => {
                                                            setSelectedArticle(article._id);
                                                            setShowModal(true);
                                                        }}>
                                                            <i className="fas fa-times"></i>
                                                        </div>
                                                    </td>
                                                )}
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
                                        {route === config.BASE_ROUTE.MAGASIN && <td></td>}
                                    </tr>
                                </tbody>
                            </table>
                            {fullfiled && (
                                <div className="printable-title">Validée</div>
                            )}
                        </PrintComponent>
                    </div>
                    {route === config.BASE_ROUTE.MAGASIN && (
                        <div className="cmd-btn-group">
                            <div>
                                <div className="flat-btn-small btn-green" onClick={handleConfirmCommand}><i className="fas fa-thumbs-up"></i></div>
                            </div>
                            <div className="flat-btn-small btn-red" onClick={handleCancelCommand}><i className="fas fa-thumbs-down"></i></div>
                        </div>
                    )}
                    {showModal && (
                        <div className="modal">
                            <div className="modal-message">Retirer {articles.find(article => article._id === selectedArticle).name} ??</div>
                            <div className="modal-btn-group">
                                <div className="flat-btn btn-red" onClick={handleRemoveArticle}>Oui</div>
                                <div className="flat-btn btn-blue" onClick={() => setShowModal(false)}>Non</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandDetail;
