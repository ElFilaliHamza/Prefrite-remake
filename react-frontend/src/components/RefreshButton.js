import React from 'react';

const RefreshButton = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div
      className="refresh-btn"
      tabIndex={0}
      onClick={handleRefresh}
      style={{ margin: '5px 10px' }}
    >
      <i className="fas fa-sync-alt" />
    </div>
  );
};

export default RefreshButton;
