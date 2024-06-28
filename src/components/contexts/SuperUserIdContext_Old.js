// SuperUserIdContext.js
import React, { createContext, useContext, useState } from 'react';

const SuperUserIdContext = createContext();

export const SuperUserIdProvider = ({ children }) => {
  const [superUserId, setSuperUserId] = useState(null);
  return (
    <SuperUserIdContext.Provider value={{ superUserId, setSuperUserId }}>
      {children}
    </SuperUserIdContext.Provider>
  );
};

export const useSuperUserId = () => useContext(SuperUserIdContext);
