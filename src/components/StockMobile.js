import React from "react";
import { useSellerData } from "./contexts/SellerContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const COLORS = ["#FFC300", "#4BC0C0", "#FF6384"];

const StockMobile = () => {
  const {sellerData} = useSellerData();

  if (!sellerData) {
    return <div>Error loading seller data</div>;
  }

  const products = sellerData?.artsNcats?.arts || [];
  const stats = sellerData?.artsNcats?.stats || {};

  // Prepare data for the Pie chart
  const chartData = [
    { name: "Credit", value: stats.credit },
    { name: "Paid", value: stats.paid },
    { name: "Left to Sell", value: stats.leftToSell },
  ];

  // Filter products with sellerQt greater than 0
  const filteredProducts = products.filter((product) => product.sellerQt > 0);

  return (
    <div className="stock-mobile-page">
      <h1>Stock Mobile</h1>
      <div className="stats-chart">
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ percent }) => `${(percent * 100).toFixed(2)}%`} // Format label to show percentage with two decimal places
            labelLine={false} // Disable connecting line between label and pie chart
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <table className="content-table">
        <thead>
          <tr>
            <th className="heading">Product</th>
            <th className="heading">Unité</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td className="heading">{product.sellerQt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockMobile;
