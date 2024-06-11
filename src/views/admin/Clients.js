import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { fetchAdminSellers, fetchClients } from '../../api/adminAPI';
import api from '../../api/api';
import '../../assets/css/Styles/Clients.css';

const Clients = () => {
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');
    const [search, setSearch] = useState('');
    const [skip, setSkip] = useState(0);
    const [endClients, setEndClients] = useState(false);
    const limit = 10; // Number of clients to fetch per request

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const sellersData = await fetchAdminSellers();
                setSellers(sellersData);

                const clientsData = await fetchClients(skip, search, selectedSeller);
                setClients(clientsData.clients);
                setEndClients(clientsData.endClients);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setSkip(0);
        getNewClients();
    };

    const handleSellerChange = (e) => {
        setSelectedSeller(e.target.value);
        setSkip(0);
        getNewClients();
    };
    const getNewClients = async () => {
        try {
            const clientsData = await fetchClients(skip, search, selectedSeller);
            setClients(clientsData.clients);
            setEndClients(clientsData.endClients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };
    // const handleSearchSubmit = async (e) => {
    //     e.preventDefault();
    //     setSkip(0);
    //     getNewClients();
    // };

    const loadMoreClients = async () => {
        try {
            const response = await api.post('/admin/clients/get', {
                skip: skip + limit,
                search,
                sellerId: selectedSeller
            });
            const moreClients = response.data.clients;
            setClients((prevClients) => [...prevClients, ...moreClients]);
            setSkip((prevSkip) => prevSkip + moreClients.length);
            setEndClients(response.data.endClients);
        } catch (error) {
            console.error('Error loading more clients:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <form >
                        <div>Vendeur:
                            <select className="form-control" value={selectedSeller} onChange={handleSellerChange}>
                                <option value=""></option>
                                {sellers.map(seller => (
                                    <option key={seller._id} value={seller._id}>{seller.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>Client:
                            <input
                                className="form-control"
                                placeholder="Client"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <input type="submit" hidden />
                    </form>
                    <div className="card-list card-list-clients">
                        <a className="app-card card-add" href="/admin/addClient"><i className="fas fa-plus"></i></a>
                        {clients.map(client => (
                            <a key={client._id} className="app-card" href={`/admin/client/${client._id}`}>{client.name}</a>
                        ))}
                    </div>
                    {!endClients && (
                        <div className="flat-btn-small btn-blue show-more-btn" onClick={loadMoreClients}>
                            Afficher plus
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Clients;
