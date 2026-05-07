export const formatPrice = (price) => {
  if (!price) return 'Price on request';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
};
