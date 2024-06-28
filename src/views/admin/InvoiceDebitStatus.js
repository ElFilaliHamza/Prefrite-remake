import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchInvoicesDebitData } from "../../api/invoicesAPI";
import Loading from "../../components/Loading";
import { usePrintComponent } from "../../tools/printComponent";
import PathNav from "../../components/PathNav";

const InvoiceDebitStatus = ({route}) => {
    const { idClient } = useParams();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [handlePrint, PrintComponent] = usePrintComponent();
    const navItems = [
        { path: `/${route}`, label: '', isHome: true, isCurr: false },
        { path: `/${route}/stats`, label: 'Etat', isHome: false, isCurr: false },
        { path: `/${route}/debitStatus`, label: 'Vendeurs', isHome: false, isCurr: true },
    ];

    useEffect(() => {
        const getInvoicesData = async () => {
            try {
                
                const data = await fetchInvoicesDebitData(idClient, route);
                setInvoices(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching invoices data:", error);
                setLoading(false);
            }
        };

        getInvoicesData();
    }, [idClient,route]);

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
                        <div className="printable-title">Credit BL</div>
                        <div className="time-interval-message">{currentDate}</div>
                        <PrintComponent>
                            <table className="table shadow">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>id</th>
                                        <th>Total</th>
                                        <th>Credit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((invoice) => (
                                        <tr key={invoice._id}>
                                            <td className="td-link">
                                                <Link
                                                    to={`/${route}/debitStatusInvoice/${invoice._id}`}
                                                >
                                                    {invoice._id}
                                                </Link>
                                            </td>
                                            <td className="td-link">
                                                <Link
                                                    to={`/${route}/debitStatusInvoice/${invoice._id}`}
                                                >
                                                    {invoice.total.toFixed(2)}
                                                </Link>
                                            </td>
                                            <td className="td-link">
                                                <Link
                                                    to={`/${route}/debitStatusInvoice/${invoice._id}`}
                                                >
                                                    {invoice.debit.toFixed(2)}
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

export default InvoiceDebitStatus;
