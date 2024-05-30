export const calculateDaysInterval = (start, end) => {
    if (start && end) {
      return (new Date(end) - new Date(start)) / 86400000 + 1;
    }
    return null;
  };