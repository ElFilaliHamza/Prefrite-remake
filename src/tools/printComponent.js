// printUtils.js
import { useReactToPrint } from 'react-to-print';
import React, { useRef } from 'react';

export const usePrintComponent = () => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const PrintComponent = ({ children }) => (
    <div ref={componentRef}>
      {children}
    </div>
  );

  return [handlePrint, PrintComponent];
};
