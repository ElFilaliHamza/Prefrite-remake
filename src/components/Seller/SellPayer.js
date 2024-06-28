// src/components/SellPayer.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSell } from '../contexts/SellContext';
import { buyArts } from '../../api/payments';

const SellPayer = () => {
    const { panierArticles, totalPrice, client, reset } = useSell();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(totalPrice);
    const [error, setError] = useState(null);

    const handlePaymentChange = (e) => {
        setPayment(parseFloat(e.target.value) || 0);
    };

    const handlePay = async () => {
        try {
            const response = await buyArts(client._id, panierArticles, payment);
            if (response.invoiceId) {
                // Navigate to the invoice page or show success message
                navigate('/seller');
                reset();
            } else {
                // Handle the case where the payment didn't succeed but no specific error was thrown
                setError('Payment failed. Please try again.');
            }
        } catch (error) {
            // Handle the error response
            setError('Payment processing failed. Please check the details and try again.');
        }
    };

    if (!client) {
        navigate('/');
        return null;
    }

    return (
        <div className="app-container">
            <div className="content">
                <div className="content__inner">
                    <div className="Container">
                        <h2 className="text-center">Paiement</h2>
                        <div className="invoice-card">
                            <div className="invoice-title">
                                <div className="main-title">
                                    <h4 className="company-name seller-company-name">Prefrite</h4>
                                </div>
                                <div className="invoice-info">
                                    <div className="invoice-info-item">CLIENT: {client.name}</div>
                                    <div className="invoice-info-item">ICE: {client.ICE}</div>
                                    <div className="invoice-info-item">DATE: {new Date().toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="invoice-details">
                                <table className="invoice-table">
                                    <thead>
                                        <tr>
                                            <td>PRODUIT</td>
                                            <td>QTE</td>
                                            <td>PRIX</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {panierArticles.map((product) => (
                                            <tr key={product._id}>
                                                <td>{product.name}</td>
                                                <td>{product.qt}</td>
                                                <td>{product.price} DHS</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="invoice-footer-details">
                                <table className="invoice-table">
                                    <tbody>
                                        <tr>
                                            <th className="total">TOTAL:</th>
                                            <td className="total">{totalPrice} DHS</td>
                                        </tr>
                                        <tr>
                                            <th className="total">TOTAL PAYÉ:</th>
                                            <td className="total">{payment} DHS</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="button-row d-flex mt-4">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Payer"
                                value={payment}
                                onChange={handlePaymentChange}
                            />
                            <button className="btn btn-primary ml-auto" onClick={handlePay}>
                                Payer
                            </button>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellPayer;
