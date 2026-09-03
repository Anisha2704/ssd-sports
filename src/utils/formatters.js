/**
 * Format a price amount and currency code using Intl.NumberFormat
 * 
 * @param {number|string} amount
 * @param {string} currencyCode
 * @returns {string} Formatted price string (e.g. "$49.99")
 */
export function formatPrice(amount, currencyCode = 'USD') {
  if (amount === undefined || amount === null) return '';
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) return '';

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(numericAmount);
  } catch (error) {
    return `${currencyCode} ${numericAmount.toFixed(2)}`;
  }
}
