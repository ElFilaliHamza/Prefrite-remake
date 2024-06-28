import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import '../../assets/css/Styles/AdminDashboard.css'; // Adjust the path to your CSS file if necessary

const colors = ["#2b2d42", "#ff6f59", "#784f41", "#8e5572", "#f8c630", "#23967f", "#724e91"];

const MagasinDashboard = ({route}) => {
    const [pendingCommands, setPendingCommands] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmdResponse = await api.post(`/${route}/cmd/count`);
                if (cmdResponse.data.count !== undefined) {
                    setPendingCommands(cmdResponse.data.count);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [route]);

    return (
        <div className="app-container">
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
                        <div className={`card-status ${pendingCommands > 0 ? 'card-danger-status' : 'card-success-status'}`}>
                            {pendingCommands > 0 ? (pendingCommands) : (<i class="fas fa-check"></i>)}

                            </div>
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
                    </a>
                </div>
            </div>
        </div>
    );
};

export default MagasinDashboard;

