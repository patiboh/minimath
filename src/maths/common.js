const common = {
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
   * @param {number|Object} n
   * @returns {boolean}
   */
  equals(a, b) {
    return a === b
  }
}

module.exports = common