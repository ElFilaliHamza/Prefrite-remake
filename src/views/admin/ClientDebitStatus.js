import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchClientsDebitData } from "../../api/clientsAPI";
import Loading from "../../components/Loading";
import { usePrintComponent } from "../../tools/printComponent";
import PathNav from "../../components/PathNav";

const ClientDebitStatus = ({route}) => {
    const { idSeller } = useParams();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [handlePrint, PrintComponent] = usePrintComponent();
    const navItems = [
        { path: `/${route}`, label: '', isHome: true, isCurr: false },
        { path: `/${route}/stats`, label: 'Etat', isHome: false, isCurr: false },
        { path: `/${route}/debitStatus`, label: 'Vendeurs', isHome: false, isCurr: true },
    ];
    useEffect(() => {
        const getClientsData = async () => {
            try {
                const endpoint_route = `/${route}/debit/getClients`
                const data = await fetchClientsDebitData(idSeller, endpoint_route);
                setClients(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching clients data:", error);
                setLoading(false);
            }
        };

        getClientsData();
    }, [idSeller]);

    if (loading) {
        return <Loading />;
    }

    const currentDate = new Date().toLocaleString();

    return (
        <div className="app-container">
            <PathNav navItems={navItems} />

            <div className="simple-container">
                <div>
                    <button
                        className="flat-btn-small flat-btn-center btn-blue"
                        onClick={handlePrint}
                    >
                        Imprimer
                    </button>
                    <div style={{ margin: "20px" }}>
                        <div className="printable-title">Credit par Clients</div>
                        <div className="time-interval-message">{currentDate}</div>
                        <PrintComponent>
                            <table className="table shadow">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Client</th>
                                        <th>Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client) => (
                                        <tr key={client._id}>
                                            <td className="td-link">
                                                <Link
                                                    to={`/${route}/invoiceDebitStatus/${client._id}`}
                                                >
                                                    {client.name}
                                                </Link>
                                            </td>
                                            <td className="td-link">
                                                <Link
                                                    to={`/${route}/invoiceDebitStatus/${client._id}`}
                                                >
                                                    {client.debit.toFixed(2)}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </PrintComponent>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ClientDebitStatus;
