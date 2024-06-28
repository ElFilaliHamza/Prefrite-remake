import React, { useState, useEffect, useCallback } from "react";
import Loading from "../../components/Loading";
import { fetchRouteCommands } from "../../api/adminAPI";
import config from "../../config/config";
import { formatDate } from "../../tools/dates";

const Commandes = () => {
  const [commands, setCommands] = useState([]);
  const [skip, setSkip] = useState(0); // State to keep track of how many items to skip
  const [loading, setLoading] = useState(false); // State to handle loading state

  const loadArticles = useCallback(async () => {
    try {
      console.log("Fetching data...");
      setLoading(true); // Set loading to true before fetching
      const response = await fetchRouteCommands({ route: config.BASE_ROUTE.SELLER, skip });
      // Filter out duplicate commands based on _id
      const newCommands = response.commands.filter(
        (cmd) => !commands.some((existingCmd) => existingCmd._id === cmd._id)
      );
      setCommands((prevCommands) => [...prevCommands, ...newCommands]); // Append new commands to the existing ones
      setLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  }, [skip, commands]);

  useEffect(() => {
    loadArticles();
  }, [skip, loadArticles]); // Include loadArticles in the dependency array

  // Function to load more commands
  const loadMore = () => {
    setSkip((prevSkip) => prevSkip + 10); // Increase the skip value by 10 (or any number of items you want to load each time)
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="commandes-container">
      <div className="content">
        <div className="content__inner">
          <div className="Container">
            <div className="multisteps-form">
              <div className="simple-container">
                <table className="table list-invoice-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Arts</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commands.map((command, idx) => (
                      <tr key={command._id + idx}>
                        <td className="td-link">
                          <a href={`/seller/cmd/${command._id}`}>
                            {formatDate(command.time)}
                          </a>
                        </td>
                        <td className="td-link">
                          <a href={`/seller/cmd/${command._id}`}>
                            {command.artCount}
                          </a>
                        </td>
                        <td className="td-link">
                          <a href={`/seller/cmd/${command._id}`}>
                            <div
                              className={
                                command.fullfiled
                                  ? "invoice-status-cool"
                                  : "invoice-status-uncool"
                              }
                            >
                              <i
                                className={
                                  command.fullfiled
                                    ? "fas fa-check"
                                    : "fas fa-bell"
                                }
                              ></i>
                            </div>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  className="flat-btn-small btn-blue show-more-btn"
                  onClick={loadMore}
                >
                  {loading ? "Loading..." : "Afficher plus"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commandes;
