// Function to format the value with two decimal places
export const formatValue = (value) => parseFloat(value).toFixed(2);
export const formatNumber = (number) => (number ? number.toFixed(2) : "0.00");
