import React from 'react';

const PrintInvoice = ({ vendeur, articles }) => {
    return (
        <div className="art-adding-body">
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
                            <td>{new Date().toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="clearfix"></div>
                <section id="items">
                    <table cellpadding="0" cellspacing="0">
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
                    <table cellpadding="0" cellspacing="0">
                        <thead></thead>
                        <tbody>
                            <tr className="amount-total">
                                <th>TOTAL:</th>
                                <td>
                                    {articles.reduce((sum, article) => sum + (article.qt * article.prixVente), 0).toFixed(2)} <span>DHS</span>
                                </td>
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

export default PrintInvoice;
