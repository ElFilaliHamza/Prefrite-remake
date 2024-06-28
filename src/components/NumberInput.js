import React from "react";

const NumberInput = ({ value, onChange, className = "form-control", step = "any", min = "0" }) => {
  const handleWheel = (e) => {
    e.preventDefault();
    e.target.blur();
  };

  return (
    <input
      className={className}
      type="number"
      step={step}
      min={min}
      value={value}
      onChange={onChange}
      onWheel={handleWheel}
    />
  );
};

export default NumberInput;
