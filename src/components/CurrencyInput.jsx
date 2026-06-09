import React from 'react';

export default function CurrencyInput({ value, onChange, placeholder, style }) {
  
  const handleChange = (e) => {
    // Remove all non-digits
    let rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      onChange('');
      return;
    }
    // Convert to float (last two digits are decimals)
    const floatValue = parseInt(rawValue, 10) / 100;
    onChange(floatValue); // Send raw float to parent
  };

  // Format float to pt-BR string
  const displayValue = value === '' ? '' : new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder || "0,00"}
      style={style}
    />
  );
}
