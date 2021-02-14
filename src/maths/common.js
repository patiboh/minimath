const common = {
  /**
   * Round to precision
   * src: https://www.jacklmoore.com/notes/rounding-in-javascript/
   * @param {number|Object} n
   * @returns {boolean}
   */
  round(n, decimals) {
    return Number(Math.round(n+'e'+decimals)+'e-'+decimals);
  },
  /**
   * @param {number|Object} n
   * @returns {boolean}
   */
  isScalar(n) {
    return typeof n === 'number' && !Number.isNaN(n)
  },

  /**
   * @param {number|Object} n
   * @returns {boolean}
   */
  isNeg(n) {
    return n !==0 && n + Math.abs(n) === 0;
  },
  
  /**
   * @param {number|string|Object} a
   * @param {number|string|Object} b
   * @returns {boolean}
   */
  equals(a, b) {
    if(common.isScalar(a) && common.isScalar(b)){
      return common.round(a, 4) === common.round(b, 4)
    }
    return a === b
  }
}

module.exports = common