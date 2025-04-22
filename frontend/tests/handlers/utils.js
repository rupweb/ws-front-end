export function formatDecimal (decimal) {
    if (decimal && typeof decimal === "object" && "mantissa" in decimal && "exponent" in decimal) {
      const mantissa = typeof decimal.mantissa === "bigint" ? Number(decimal.mantissa) : decimal.mantissa;
      const exponent = typeof decimal.exponent === "bigint" ? Number(decimal.exponent) : decimal.exponent;
  
      const precision = Math.abs(exponent); // Use exponent as precision
      return (mantissa * Math.pow(10, exponent)).toFixed(precision);
    }
    return null;
}