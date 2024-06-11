import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { fetchAdminCommands } from '../../api/adminAPI';

const CommandsHistory = () => {
    const [loading, setLoading] = useState(true);
    const [commands, setCommands] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [skip, setSkip] = useState(0);
    const [endCommands, setEndCommands] = useState(false);
    const limit = 10;

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await fetchAdminCommands({
                    fullfiled: true,
                    getSellers: true,
                });
                if (data) {
                    setCommands(data.commands);
                    setSellers(data.sellers);
                    setEndCommands(data.endCmds);
                } else {
                    console.error('Error fetching initial data');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setLoading(false);
            }
        };

        if (commands.length === 0) {
            fetchInitialData();
        }
    }, []);

    useEffect(() => {
        getNewCommands();
    }, [selectedSeller, startDate, endDate]);

    const loadMoreCommands = async () => {
        try {
            const data = await fetchAdminCommands({
                skip: skip + limit,
                fullfiled: true,
                filter: {
                    startTime: startDate,
                    endTime: endDate,
                    sellerCmd: selectedSeller
                }
            });

            if (data.commands.length) {
                setCommands((prevCommands) => [...prevCommands, ...data.commands]);
                setSkip((prevSkip) => prevSkip + data.commands.length);
                setEndCommands(data.endCmds);
            }
        } catch (error) {
            console.error('Error loading more commands:', error);
        }
    };

    const getNewCommands = async () => {
        try {
            const data = await fetchAdminCommands({
                fullfiled: true,
                filter: {
                    startTime: startDate,
                    endTime: endDate,
                    sellerCmd: selectedSeller
                }
            });

            if (data.commands.length) {
                setCommands(data.commands);
                setSkip(0);
                setEndCommands(data.endCmds);
            }
        } catch (error) {
            console.error('Error fetching new commands:', error);
        }
    };

    const handleSellerChange = (e) => {
        setSelectedSeller(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div className="container">
                        <div className="form-group">
                            <span>Vendeur:</span>
                            <select className="form-control" value={selectedSeller} onChange={handleSellerChange}>
                                <option value=""></option>
                                {sellers.map(seller => (
                                    <option key={seller._id} value={seller._id}>{seller.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <span>Debut:</span>
                            <input type="date" className="form-control" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div>
                            <span>Fin:</span>
                            <input type="date" className="form-control" value={endDate} onChange={handleEndDateChange} />
                        </div>
                    </div>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Vendeur</th>
                                <th>Date</th>
                                <th>Nbr</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commands.map(command => (
                                <tr key={command._id}>
                                    <td className="td-link">
                                        <a href={`/admin/command/${command._id}`}>{command.sellerInfo.name}</a>
                                    </td>
                                    <td className="td-link">
                                        <a href={`/admin/command/${command._id}`}>{new Date(command.time).toLocaleString()}</a>
                                    </td>
                                    <td className="td-link">
                                        <a href={`/admin/command/${command._id}`}>{command.artCount}</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!endCommands && (
                        <div className="flat-btn-small btn-blue show-more-btn" onClick={loadMoreCommands}>
                            Afficher plus
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandsHistory;