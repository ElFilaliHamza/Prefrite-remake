// Function to format the value with two decimal places
export const formatValue = (value) => parseFloat(value).toFixed(2);
export const formatNumber = (number) => (number ? number.toFixed(2) : "0.00");
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DHS' }).format(value);
};
