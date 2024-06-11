import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../assets/css/Styles/AdminDashboard.css'; // Adjust the path to your CSS file if necessary

const colors = ["#2b2d42", "#ff6f59", "#784f41", "#8e5572", "#f8c630", "#23967f", "#724e91"];

const MagazinDashboard = () => {
    const [totalDebit, setTotalDebit] = useState(0);
    const [pendingCommands, setPendingCommands] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmdResponse = await api.post('/admin/cmd/count');
                if (cmdResponse.data.count !== undefined) {
                    setPendingCommands(cmdResponse.data.count);
                }

                const debitResponse = await api.post('/admin/debit/count');
                if (debitResponse.data.ok) {
                    setTotalDebit(debitResponse.data.totalDebit);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="app-container">
            <div className="user-nav">
                <div className="user-nav-item">
                    <a className="user-name-title" href="/magasin">Magasinier</a>
                </div>
                <div className="user-nav-item">
                    <div className="refresh-btn" tabIndex="0"><i className="fas fa-sync"></i></div>
                    <div className="refresh-btn" tabIndex="0" style={{ margin: '5px 10px' }}><i className="fas fa-adjust"></i></div>
                    <div className="Btn logoutBtn refresh-btn"><i className="fas fa-sign-out"></i></div>
                </div>
            </div>
            <div className="simple-container">
                <div className="card-list">
                    <a
                        className="app-card modern-app-card card-c-b"
                        href="/magasin/commands"
                        style={{ backgroundColor: colors[0] }}
                    >
                        Commandes
                        <div className="card-badge">
                            <i className="fas fa-terminal"></i>
                        </div>
                        <div className="card-status card-danger-status">{pendingCommands}</div>
                    </a>
                    <a
                        className="app-card modern-app-card card-c-8"
                        href="/magasin/commandHistory"
                        style={{ backgroundColor: colors[1] }}
                    >
                        Historique Commandes
                        <div className="card-badge">
                            <i className="fas fa-history"></i>
                        </div>
                    </a>
                    <a
                        className="app-card modern-app-card card-c-3"
                        href="/magasin/commandStatus"
                        style={{ backgroundColor: colors[2] }}
                    >
                        Etat de Commandes
                        <div className="card-badge">
                            <i className="fas fa-file-alt"></i>
                        </div>
                    </a>
                    <a
                        className="app-card modern-app-card card-c-9"
                        href="/magasin/stockStatus"
                        style={{ backgroundColor: colors[3] }}
                    >
                        Etat du Stock
                        <div className="card-badge">
                            <i className="fas fa-leaf"></i>
                        </div>
                        <div className="card-status-long card-danger-status">
                            {totalDebit.toFixed(2)}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MagazinDashboard;

