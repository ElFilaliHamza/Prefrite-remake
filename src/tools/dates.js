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



