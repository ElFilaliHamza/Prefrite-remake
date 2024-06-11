import React, { useEffect, useState } from 'react';
import api from '../../api/api'; 
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminSellers } from '../../api/adminAPI';
import Loading from '../../components/Loading';


const AddClient = () => {

    const { idSeller } = useParams();
    const [name, setName] = useState('');
    const [ice, setIce] = useState('');
    const [plafon, setPlafon] = useState('');
    const [sellerId, setSellerId] = useState(idSeller);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const data = await fetchAdminSellers();
                setSellers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sellers:', error);
                setLoading(false);
            }
        };

        fetchSellers();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/clients/add', {
                name,
                ice,
                plafon: parseFloat(plafon),
                sellerId
            });
            if (response.data.ok) {
                navigate('/admin/vendeurs'); // Redirect to clients list page
            } else {
                setError(response.data.errorMessage || 'An error occurred');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div className="path-nav">
                        <a className="path-btn" href="/admin"><i className="fas fa-home"></i></a>
                        <a className="path-nav-item" href="/admin/clients">Clients</a>
                    </div>
                    <div className="add-page">
                        <form className="add-form" onSubmit={handleSubmit}>
                            <div className="appTitle">Ajouter un client</div>
                            {error && <div className="error">{error}</div>}
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
                                    placeholder="Nombre ICE"
                                    value={ice}
                                    onChange={(e) => setIce(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="appInput">
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="Plafon"
                                    value={plafon}
                                    onChange={(e) => setPlafon(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                Vendeur:
                                <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} required>
                                    <option value=""></option>
                                    {sellers.map((seller) => (
                                        <option key={seller._id} value={seller._id}>
                                            {seller.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <label tabindex="0" className="submit-btn">
                                <input type="submit" hidden />Creer
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddClient;
