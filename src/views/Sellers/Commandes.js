import React, { useState, useEffect } from "react";
import { fetchCmds } from "../../api/sellersAPI";
import Loading from "../../components/Loading";

const Commandes = () => {
  const [commands, setCommands] = useState([]);
  const [skip, setSkip] = useState(0); // State to keep track of how many items to skip
  const [loading, setLoading] = useState(false); // State to handle loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await fetchCmds(skip);
        // Filter out duplicate commands
        const newCommands = response.commands.filter(
          (cmd) => !commands.some((existingCmd) => existingCmd._id === cmd._id)
        );
        setCommands((prevCommands) => [...prevCommands, ...newCommands]); // Append new commands to the existing ones
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false if there's an error
      }
    };

    fetchData();
  }, [skip]); // Trigger useEffect when skip changes

  // Function to format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Format the date as per your requirement
  };

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
                    {commands.map((command) => (
                      <tr key={command._id}>
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
