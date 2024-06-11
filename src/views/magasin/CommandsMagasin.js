import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import '../../assets/css/Styles/Styles.css';
import { fetchMagasinCommands } from '../../api/magasinAPI';

const CommandsMagasin = ({route}) => {
    const [loading, setLoading] = useState(true);
    const [commands, setCommands] = useState([]);
    const [skip, setSkip] = useState(0);
    const [endCommands, setEndCommands] = useState(false);
    const limit = 10; // Number of commands to fetch per request

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await fetchMagasinCommands();
                if (data) {
                    setCommands(data.commands);
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

        fetchInitialData();
    }, []);

    const loadMoreCommands = async () => {
        try {
            const data = await fetchMagasinCommands({ skip: skip + limit });
            if (data.commands.length) {
                setCommands((prevCommands) => [...prevCommands, ...data.commands]);
                setSkip((prevSkip) => prevSkip + data.commands.length);
                setEndCommands(data.endCmds);
            } else {
                setEndCommands(true);
            }
        } catch (error) {
            console.error('Error loading more commands:', error);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div className="path-nav">
                        <a className="path-btn path-btn-current" href={`${route}`}><i className="fas fa-home"></i></a>
                    </div>
                    <div className="card-list black-card-text">
                        {commands.map((command) => (
                            <a key={command._id} className="app-card" href={`/${route}/command/${command._id}`}>
                                {command.sellerInfo.name}
                                <div className={`card-status ${command.artCount > 0 ? 'card-wait-status' : ''}`}>{command.artCount}</div>
                            </a>
                        ))}
                    </div>
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

export default CommandsMagasin;
