import React, { useState, useContext } from 'react';
import { usePanierContext } from '../contexts/SellContext_Old';
import { useSell } from '../contexts/SellContext';
import { useNavigate } from 'react-router-dom';
import { useSellerData } from '../contexts/SellerContext';

const SellArticles = ({ categoryId }) => {
    const { articles } = useSellerData();
    const [quantities, setQuantities] = useState({});
    const { addArticleToPanier, client } = useSell();
    const navigate = useNavigate();
    const handleQuantityChange = (articleId, quantity) => {
        addArticleToPanier({articleId: articleId, quantity: quantity});
    };

    const handleAddToCart = () => {
        navigate(`/seller/sell/cats/${client._id}`);
    };

    if(!articles){
        return <div>No articles found</div>
    }

    return (
        <div className="table-responsive">
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Nom</th>
                        <th>Qt Disp</th>
                        <th>Qte</th>
                        <th>Prix</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article) => (
                        <tr key={article._id}>
                            <td>{article.name}</td>
                            <td>{article.sellerQt}</td>
                            <td>
                                <input
                                    type="number"
                                    value={quantities[article._id] || ""}
                                    onChange={(e) =>
                                        handleQuantityChange(article._id, parseFloat(e.target.value) || 0)
                                    }
                                />
                            </td>
                            <td>{article.prixVente} DHS</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="2"></td>
                        <td><strong>Total: </strong></td>
                        <td><strong>{/* Calculate total here */} DHS</strong></td>
                    </tr>
                </tbody>
            </table>
            <div className="button-row d-flex mt-4">
                <button
                    className="flat-btn-small btn-red"
                    onClick={() => window.history.back()}
                >
                    Annuler
                </button>
                <button
                    className="ml-auto flat-btn-small btn-blue"
                    onClick={handleAddToCart}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default SellArticles;
