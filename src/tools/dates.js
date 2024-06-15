export const calculateDaysInterval = (start, end) => {
  if (start && end) {
    return (new Date(end) - new Date(start)) / 86400000 + 1;
  }
  return null;
};

export const getTodayDate = () => {
  try{

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }catch(e){
    return '2024-06-07';
  }
};
export const dateToString = (date) => {
  try{

    const new_date = new Date(date).toLocaleString()
    return new_date !== 'Invalid Date' ? new_date : '';
  }catch(e){
    return '';
  }
};





