import React from 'react';

export const formatNumber = (number, exp = 2) => {
  const f = parseFloat(number);
  if (isNaN(f)) {
    return Number(0).toFixed(exp)
  }
  return f.toFixed(exp);
};

export const renderCount = (count) => {
  return <span>{ count || 0 }</span>;
};

export const renderAmount = (amount) => {
  return amount ?
    <span>￥{ formatNumber(amount) }</span> :
    <span>￥0</span>;
};
