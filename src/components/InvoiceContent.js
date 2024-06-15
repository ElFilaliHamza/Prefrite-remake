import React, { useEffect, useState } from 'react';
import { formatNumber } from '../tools/global';
import api from '../api/api';

const InvoiceContent = ({ sellerData }) => {
    const { vendeur, stats } = sellerData;
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentDate = new Date().toLocaleString();

    useEffect(() => {
        const getSellerInvoice = async () => {
            try {
                const response = await api.post('/admin/vendeurs/getInvoice', { _id: vendeur._id });
                setArticles(response.data.articles);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching seller details:', error);
                setLoading(false);
            }
        };

        getSellerInvoice();
    }, [vendeur._id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="art-adding-body myprint-modal">
            <div id="ContaineR">
                <section id="invoice-title-number">
                    <div className="company-name">Prefrite</div>
                    <span id="title">Facture Vendeur</span>
                </section>
                <div className="clearfix"></div>
                <table id="client-info">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>VENDEUR:</td>
                            <td>{vendeur.name}</td>
                        </tr>
                        <tr>
                            <td>DATE:</td>
                            <td>{currentDate}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="clearfix"></div>
                <section id="items">
                    <table cellPadding="0" cellSpacing="0">
                        <thead>
                            <tr>
                                <th></th>
                                <th>PRODUIT</th>
                                <th>UNITÉ</th>
                                <th>PRIX</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article, index) => (
                                <React.Fragment key={article._id}>
                                    <tr>
                                        <td>{index + 1}.</td>
                                        <td>{article.name}</td>
                                        <td>{article.qt}</td>
                                        <td>{article.qt * article.prixVente}<span>DHS</span></td>
                                    </tr>
                                    <tr border="true">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>{article.qt} x {article.prixVente}<span>DHS</span></td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section id="sums">
                    <table cellPadding="0" cellSpacing="0">
                        <thead></thead>
                        <tbody>
                            <tr className="amount-total">
                                <th>TOTAL:</th>
                                <td>{formatNumber(
                                    articles.reduce((total, article) => total + (article.qt * article.prixVente), 0)
                                )} <span>DHS</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="clearfix"></div>
                </section>
                <div className="clearfix"></div>
                <div className="clearfix"></div>
                <div className="clearfix"></div>
            </div>
        </div>
    );
};

export default InvoiceContent;
