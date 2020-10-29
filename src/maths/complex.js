// @ts-check
const common = require('./common')

const complex = {
  /**
   * @param {number|Object} n
   * @returns {boolean}
   */
  isComplex(n) {
    if(typeof n === 'object' && n.hasOwnProperty('re') && n.hasOwnProperty('im') )  {
      return common.isScalar(n.re) && common.isScalar(n.im)
    }
    return false
  },
  /**
   * @param {Object | number} a
   * @param {number} b
   * @returns {string}
   */
  toString(a, b) {
    const math = this
    let re = a
    let im = b
    if(b === null) {
      if (common.isScalar(a)) {
        return String(a)
      }
      if(math.isComplex(a)) {
        re = a.re
        im = a.im
      }
      throw Error(`toString - ${re} and/or ${im} are NaN`)
    }
    // TODO : cleanup
    let reString = re
    let imString = ''
    let operator = ''
    if(re === 0) {
      reString = ''
      if(!im || im === 0) {
        imString = '0'
      } else if(Math.abs(im) === 1) {
        imString= 'i'
      } else {
        imString= `${im}i`
      }
    } else{
      operator = common.isNeg(im) ? ' - ' : ' + '; 
      if(Math.abs(im) === 1) {
        imString= 'i'
      } else if(im !== 0) {
        imString= `${Math.abs(im)}i`
      } else {
        operator = ''
      }
    }
    return `${reString}${operator}${imString}`
  },
 /**
   * @param {number|null} re real part of complex number
   * @param {number|null} im imaginary part of complex number
   * @returns {Object} complex number
   */
  create(re = null, im = null) {
    const math = this
    if(im === null) {
      if(re && !common.isScalar(re)) {
        throw Error(`create - ${re} is NaN`)
      }
      im = 0
    }
    if(re === null) {
      re = 0
    }
    if(!common.isScalar(re) && !common.isScalar(im)) {
      throw Error(`create - ${re} and ${im} are NaN`)
    }
    return {
      re,
      im, // im * i
      value: math.toString(re, im),
    }
  },
}

module.exports = complex