import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Loading from '../../components/Loading';

const ClientDetail = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [formData, setFormData] = useState({
        ice: '',
        name: '',
        plafon: '',
        sellerId: '',
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await api.post('/admin/clients/getOne', { _id: clientId });
                if (response.data.error) {
                    console.error('Error fetching client data:', response.data);
                } else {
                    setClient(response.data);
                    setFormData({
                        ice: response.data.ice,
                        name: response.data.name,
                        plafon: response.data.plafon,
                        sellerId: response.data.sellerId,
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching client data:', error);
                setLoading(false);
            }
        };

        const fetchSellers = async () => {
            try {
                const response = await api.post('/admin/vendeurs/get');
                if (response.data) {
                    setSellers(response.data);
                } else {
                    console.error('Error fetching sellers data');
                }
            } catch (error) {
                console.error('Error fetching sellers data', error);
            }
        };

        fetchClient();
        fetchSellers();
    }, [clientId]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            const response = await api.post('/admin/clients/update', { _id: clientId, ...formData });
            if (response.data.ok) {
                setClient({ ...client, ...formData });
                setEditMode(false);
            } else {
                console.error('Error updating client:', response.data);
            }
        } catch (error) {
            console.error('Error updating client:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await api.post('/admin/clients/deleteClient', { _id: clientId });
            if (response.data.ok) {
                navigate('/admin/clients');
            } else {
                console.error('Error deleting client:', response.data);
            }
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) {
        return <Loading />;
    }

    if (!client) {
        return <div>No client data found.</div>;
    }

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div className="path-nav">
                        <a className="path-btn" href="/admin"><i className="fas fa-home"></i></a>
                        <a className="path-nav-item" href="/admin/clients">Clients</a>
                    </div>
                    <div className="client-page">
                        <div className="client-actions client-actions-top">
                            {editMode ? (
                                <div className="flat-btn-small btn-green" onClick={handleSave}><span>Terminer</span><i className="far fa-check"></i></div>
                            ) : (
                                <div className="client-actions-group">
                                    <div className="flat-btn-small btn-green" onClick={handleEdit}><span>Modifier</span><i className="far fa-pen"></i></div>
                                    <div className="flat-btn-small btn-red" onClick={() => setShowDeleteModal(true)}><span>Supprimer</span><i className="far fa-trash"></i></div>
                                </div>
                            )}
                            <div className="flat-btn-small btn-blue" onClick={handlePrint}><span>Imprimer</span><i className="far fa-print"></i></div>
                        </div>
                        <div className="client-info">
                            <div className="client-title">Carte Client</div>
                            <div className="client-info-line">
                                <div className="client-info-title">ICE: </div>
                                <div className="client-info-content">
                                    {editMode ? (
                                        <div><input name="ice" value={formData.ice} onChange={handleChange} /></div>
                                    ) : (
                                        client.ice
                                    )}
                                </div>
                            </div>
                            <div className="client-info-line">
                                <div className="client-info-title">Nom: </div>
                                <div className="client-info-content">
                                    {editMode ? (
                                        <div><input name="name" value={formData.name} onChange={handleChange} /></div>
                                    ) : (
                                        client.name
                                    )}
                                </div>
                            </div>
                            <div className="client-info-line">
                                <div className="client-info-title">Plafond: </div>
                                <div className="client-info-content">
                                    {editMode ? (
                                        <div><input type="number" step="any" name="plafon" value={formData.plafon} onChange={handleChange} /></div>
                                    ) : (
                                        client.plafon
                                    )}
                                </div>
                            </div>
                            <div className="client-info-line">
                                <div className="client-info-title">Vendeur: </div>
                                <div className="client-info-content">
                                    {editMode ? (
                                        <div>
                                            <select name="sellerId" value={formData.sellerId} onChange={handleChange}>
                                                <option value=""></option>
                                                {sellers.map(seller => (
                                                    <option key={seller._id} value={seller._id}>{seller.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ) : (
                                        client.sellerInfo.name
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="client-actions client-actions-bottom">
                            {editMode ? (
                                <div className="flat-btn-small btn-green" onClick={handleSave}><span>Terminer</span><i className="far fa-check"></i></div>
                            ) : (
                                <div className="client-actions-group">
                                    <div className="flat-btn-small btn-green" onClick={handleEdit}><span>Modifier</span><i className="far fa-pen"></i></div>
                                    <div className="flat-btn-small btn-red" onClick={() => setShowDeleteModal(true)}><span>Supprimer</span><i className="far fa-trash"></i></div>
                                </div>
                            )}
                            <div className="flat-btn-small btn-blue" onClick={handlePrint}><span>Imprimer</span><i className="far fa-print"></i></div>
                        </div>
                    </div>
                    {showDeleteModal && (
                        <div className="modal">
                            <div className="modal-message">Supprimer {client.name}?</div>
                            <div className="modal-btn-group">
                                <div className="flat-btn btn-red" onClick={handleDelete}>Oui</div>
                                <div className="flat-btn btn-blue" onClick={() => setShowDeleteModal(false)}>Non</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;
