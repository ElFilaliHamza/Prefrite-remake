import React from "react";
import { Link } from "react-router-dom";
import { useSellerData } from "../../components/contexts/SellerContext";
import { formatNumber } from "../../tools/global";

const SellerDashboard = () => {
  const {sellerData} = useSellerData();

  if (!sellerData) {
    return <div>Error loading seller data</div>;
  }

  const stats = sellerData?.artsNcats?.stats || {
    _id: null,
    sold: 0,
    paid: 0,
    profit: 0,
    credit: 0,
    debit: 0,
    leftToSell: 0,
  };


  return (
    <div className="content">
      <div className="content__inner">
        <div className="Container">
          <div className="multisteps-form">
            <div className="">
              <div className="seller-dashboard">
                <div className="card-list black-card-text">
                  <Link className="small-app-card" to="/seller/sell">
                    <span>Vente</span>&nbsp;
                    <i
                      className="fas fa-money-bill"
                      style={{ color: "rgb(87, 199, 87)" }}
                    ></i>
                  </Link>
                  <Link className="small-app-card" to="/seller/invoices">
                    <span>Bon de livraison</span>&nbsp;
                    <i
                      className="fas fa-copy"
                      style={{ color: "rgb(85, 85, 85)" }}
                    ></i>
                  </Link>
                  <Link className="small-app-card" to="/seller/state">
                    <span>Stock Mobile</span>&nbsp;
                    <i className="fas fa-cubes" style={{ color: "purple" }}></i>
                  </Link>
                  <Link className="small-app-card" to="/seller/addCommand">
                    <span>Commander</span>&nbsp;
                    <i
                      className="fas fa-terminal"
                      style={{ color: "rgb(87, 199, 87)" }}
                    ></i>
                  </Link>
                  <Link className="small-app-card" to="/seller/cmd">
                    <span>Commandes</span>&nbsp;
                    <i
                      className="fas fa-history"
                      style={{ color: "purple" }}
                    ></i>
                  </Link>
                  <div className="small-app-card">
                    <span>Revenu: </span>&nbsp;{formatNumber(stats.profit)} DHS
                  </div>
                  <div className="small-app-card">
                    <span>My Commission: </span>&nbsp;
                    {formatNumber(stats.profit * 0.02)} DHS
                  </div>
                  <Link className="small-app-card" to="/seller/invoices">
                    <span>Credit: </span>&nbsp;{formatNumber(stats.credit)} DHS
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
