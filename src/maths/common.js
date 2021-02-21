/**
 * Round to precision
 * src: https://www.jacklmoore.com/notes/rounding-in-javascript/
 * @param {number|Object} n
 * @returns {boolean}
 */
export function round(n, decimals) {
  return Number(Math.round(n+'e'+decimals)+'e-'+decimals);
}

/**
 * @param {number|Object} n
 * @returns {boolean}
 */
export function isScalar(n) {
  return typeof n === 'number' && !Number.isNaN(n)
}

/**
 * @param {number|string|Object} a
 * @param {number|string|Object} b
 * @returns {boolean}
 */
export function equals(a, b) {
  if(common.isScalar(a) && common.isScalar(b)){
    return common.round(a, 4) === common.round(b, 4)
  }
  return a === b
}