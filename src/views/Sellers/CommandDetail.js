import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCmd } from "../../api/sellersAPI";
import Loading from "../../components/Loading";

const CommandDetail = () => {
  const { idCmd } = useParams();
  const [command, setCommand] = useState(null);

  useEffect(() => {
    const fetchCommand = async () => {
      try {
        const data = await fetchCmd(idCmd);
        setCommand(data.cmd);
      } catch (error) {
        console.error("Error fetching command:", error);
      }
    };

    fetchCommand();
  }, [idCmd]);

  if (!command) {
    return <Loading />;
  }

  // Calculate the total price
  const total = command.articles.reduce(
    (sum, article) => sum + article.prixVente * article.qt,
    0
  );

  return (
    <div className="content">
      <div className="content__inner">
        <div className="Container">
          <div className="multisteps-form">
            <div className="">
              <div className="simple-container">
                <div style={{ textAlign: "center" }}>{command._id}</div>
                <div className="time-interval-message">
                  {new Date(command.time).toLocaleString()}
                </div>
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th>Article</th>
                      <th>Qte</th>
                      <th>Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {command.articles.map((article) => (
                      <tr key={article._id}>
                        <td>{article.name}</td>
                        <td>{article.qt}</td>
                        <td>{article.prixVente} DHS</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2">Total:</td>
                      <td>{total.toFixed(2)} DHS</td>
                    </tr>
                  </tfoot>
                </table>
                <div className="printable-title">
                  {command.fullfiled ? "Validée" : "Non Validée"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandDetail;
