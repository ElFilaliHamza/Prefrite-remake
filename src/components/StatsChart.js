import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChart = ({ stats }) => {
  const data = {
    labels: ['Vendue', 'à vendre', 'Credit'],
    datasets: [
      {
        label: 'Statistics',
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Color for 'Sold'
          'rgba(54, 162, 235, 0.6)',  // Color for 'Left to Sell'
          'rgba(255, 206, 86, 0.6)',  // Color for 'Credit'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',    // Border color for 'Sold'
          'rgba(54, 162, 235, 1)',    // Border color for 'Left to Sell'
          'rgba(255, 206, 86, 1)',    // Border color for 'Credit'
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.8)',  // Hover color for 'Sold'
          'rgba(54, 162, 235, 0.8)',  // Hover color for 'Left to Sell'
          'rgba(255, 206, 86, 0.8)',  // Hover color for 'Credit'
        ],
        hoverBorderColor: [
          'rgba(255, 99, 132, 1)',    // Hover border color for 'Sold'
          'rgba(54, 162, 235, 1)',    // Hover border color for 'Left to Sell'
          'rgba(255, 206, 86, 1)',    // Hover border color for 'Credit'
        ],
        data: [stats.paid, stats.leftToSell, stats.credit]
      }
    ]
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'black',
          display: true,
          formatter: ((value, context) => {
            return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
          }),
          font: {
            weight: 'bold'
          }
        }
      }
    }
  };

  return (
    <div className="stats-chart">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StatsChart;
