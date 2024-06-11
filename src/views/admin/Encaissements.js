import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import Loading from '../../components/Loading';
import { formatNumber } from '../../tools/global';

const Encaissements = () => {
    const [loading, setLoading] = useState(true);
    const [sellers, setSellers] = useState([]);
    const [totalVirsement, setTotalVirsement] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [totalStock, setTotalStock] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.post('/admin/stats/getToPay');
                const data = response.data;
                if (data.ok) {
                    const totals = data.sellers.reduce(
                        (acc, seller) => {
                            acc.totalVirsement += seller.stats?.paid || 0;
                            acc.totalCredit += seller.stats?.credit || 0;
                            acc.totalStock += seller.stats?.totalStock || 0;
                            return acc;
                        },
                        { totalVirsement: 0, totalCredit: 0, totalStock: 0 }
                    );
                    setSellers(data.sellers);
                    setTotalVirsement(totals.totalVirsement);
                    setTotalCredit(totals.totalCredit);
                    setTotalStock(totals.totalStock);
                } else {
                    console.error('Error fetching data', data);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app-container">
            <div className="user-home">
                <div className="simple-container">
                    <div>
                        <div className="flat-btn-small flat-btn-center btn-blue">Imprimer</div>
                        <div style={{ margin: '20px' }}>
                            <div className="printable-title">Encaissement</div>
                            <div className="time-interval-message">{new Date().toLocaleString()}</div>
                            <table className="legal-table">
                                <thead>
                                    <tr>
                                        <th>Vendeur</th>
                                        <th>Versement</th>
                                        <th>Credit Vendeur</th>
                                        <th>Stocke Voiture</th>
                                        <th>Signature</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sellers.map((seller) => (
                                        <React.Fragment key={seller._id}>
                                            <tr>
                                                <td>{seller.name}</td>
                                                <td>{formatNumber(seller.stats.paid)} DHS</td>
                                                <td className="debit-td">{formatNumber(seller.stats.credit)} DHS</td>
                                                <td>{formatNumber(seller.stats.totalStock)} DHS</td>
                                                <td className="signature"></td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                                    <tr>
                                        <td>Total</td>
                                        <td>{formatNumber(totalVirsement)} DHS</td>
                                        <td className="debit-td">{formatNumber(totalCredit)} DHS</td>
                                        <td>{formatNumber(totalStock)} DHS</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Encaissements;