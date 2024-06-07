// import React from "react";
// // import "../assets/css/Styles/InvoiceDetail.css"; // Import the CSS file
// import { usePrintComponent } from "../tools/printComponent";
// import "../assets/css/main.css";

// const Invoice = ({ invoice, currentDate, showPeyementHistory = false }) => {
//   const [handlePrint, PrintComponent] = usePrintComponent();

//   return (
//     <div className="app-container">
//       <div className="content">
//         <div className="content__inner">
//           <div className="Container">
//             <div className="">
//               <div className="multisteps-form__content">
//                 <>
//                   <div className="flat-btn-small btn-red">
//                     <span>Retirer</span>
//                     <i className="far fa-trash"></i>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                     }}
//                   >
//                     <a
//                       className="flat-btn-small btn-yellow"
//                       href="/seller/invoices"
//                     >
//                       Retour
//                     </a>
//                   </div>
//                 </>
//                 <div className="flat-btn-small btn-blue">
//                   <span onClick={handlePrint}>Imprimer</span>
//                   <i className="far fa-print"></i>
//                 </div>
//                 <PrintComponent>
//                   <div className="invoice-card">
//                     <div className="invoice-title">
//                       <div className="main-title">
//                         <h4 className="company-name seller-company-name">
//                           Prefrite
//                         </h4>
//                       </div>
//                       <div className="invoice-info">
//                         <div className="invoice-info-item">
//                           CLIENT : {invoice.client.name}
//                         </div>
//                         <div className="invoice-info-item">
//                           VENDEUR : Younes
//                         </div>
//                         <div className="invoice-info-item">
//                           ICE : {invoice.client.ice}
//                         </div>
//                         <div className="invoice-info-item">
//                           DATE : {currentDate}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="invoice-details">
//                       <table className="invoice-table">
//                         <thead>
//                           <tr>
//                             <td className="invoice-details-item">PRODUIT</td>
//                             <td className="invoice-details-item">QTE</td>
//                             <td className="invoice-details-item">PRIX</td>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {invoice.products.map((product) => (
//                             <tr key={product._id}>
//                               <td className="invoice-item">{product.name}</td>
//                               <td className="invoice-item">{product.qt}</td>
//                               <td className="invoice-item">
//                                 {product.price.toFixed(2)} DHS
//                                 {product.price && product.qt ? (
//                                   <div className="price-calcul">
//                                     ({product.qt} * {product.price.toFixed(2)}{" "}
//                                     DHS)
//                                   </div>
//                                 ) : null}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                     <div className="invoice-footer-details">
//                       <table className="invoice-table">
//                         <tbody>
//                           <tr className="footer-item">
//                             <th className="total">TOTAL:</th>
//                             <td className="total">{invoice.total} DHS</td>
//                           </tr>
//                           <tr className="footer-item">
//                             <th className="total">TOTAL PAYÉ:</th>
//                             <td className="total">{invoice.paid} DHS</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </PrintComponent>
//                 {showPeyementHistory && (
//                   <>
//                     <div className="title-2">Historique Payment</div>
//                     <table className="table">
//                       <thead>
//                         <tr>
//                           <th>Montant</th>
//                           <th>Date</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {invoice.payDetails.map((payment) => (
//                           <tr key={payment.time}>
//                             <td>{payment.amount} DHS</td>
//                             <td>{new Date(payment.time).toLocaleString()}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Invoice;

// New one
import React from "react";
import { usePrintComponent } from "../tools/printComponent";
import config from "../config/config";
// import "../assets/css/main.css"; // Ensure this file contains the necessary styles

const Invoice = ({ invoice, currentDate, showPeyementHistory = false, showActions = false }) => {
  const [handlePrint, PrintComponent] = usePrintComponent();

  return (
    <div className="app-container">
      <div className="simple-container">
        {showActions &&
          <>
            <div className="flat-btn-small btn-red">
              <span>Retirer</span>
              <i className="far fa-trash"></i>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <a
                className="flat-btn-small btn-yellow"
                href={`/${config.BASE_ROUTE.SELLER}/invoices`}
              >
                Retour
              </a>
            </div>
          </>
        }
        <div className="flat-btn-small flat-btn-center btn-blue" onClick={handlePrint}>Imprimer</div>
        <div style={{ margin: "20px" }}>
          <PrintComponent>
            <div className="printable-title">Bon de livraison</div>
            <div className="time-interval-message">{currentDate}</div>
            <div className="invoice-card">
              <div className="invoice-title">
                <div className="main-title">
                  <h4 className="company-name seller-company-name">Prefrite</h4>
                </div>
                <div className="invoice-info">
                  <div className="invoice-info-item">CLIENT : {invoice.client.name} / mr badaoui</div>
                  <div className="invoice-info-item">ICE : {invoice.client.ice}</div>
                  <div className="invoice-info-item">DATE : {currentDate}</div>
                </div>
              </div>
              <div className="invoice-details">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <td className="invoice-details-item">PRODUIT</td>
                      <td className="invoice-details-item">QTE</td>
                      <td className="invoice-details-item">PRIX</td>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.products.map((product, index) => (
                      <tr key={index}>
                        <td className="invoice-item">{product.name}</td>
                        <td className="invoice-item">{product.qt}</td>
                        <td className="invoice-item">
                          {product.price.toFixed(2)} DHS
                          {product.price && product.qt && (
                            <div className="price-calcul">
                              ({product.qt} * {product.price.toFixed(2)} DHS)
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="invoice-footer-details">
                <table className="invoice-table">
                  <tbody>
                    <tr className="footer-item">
                      <th className="total">TOTAL:</th>
                      <td className="total">{invoice.total} DHS</td>
                    </tr>
                    <tr className="footer-item">
                      <th className="total">TOTAL PAYÉ:</th>
                      <td className="total">{invoice.paid} DHS</td>
                    </tr>
                    <tr className="footer-item">
                      <th className="total">RESTE:</th>
                      <td className="total">{invoice.total - invoice.paid} DHS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </PrintComponent>
          {showPeyementHistory && (
            <>
              <div className="title-2">Historique Payment</div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Montant</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payDetails.map((payment, index) => (
                    <tr key={index}>
                      <td>{payment.amount} DHS</td>
                      <td>{new Date(payment.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <div className="footer-copyright">
        <div>Tous Droits Réservés © 2020 - 2024 | Ilias Al Fakir</div>
        <div>développé pour Younes Belhouss</div>
      </div>
    </div>
  );
};

export default Invoice;

