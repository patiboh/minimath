// @ts-check
const common = require('./common')

/**
 * @param {string|Object|number} s1
 * @param {string|Object|number|null} s2
 * @returns {string}
 */
function subject (s1, s2=null) {
  let subject;
  if(!s2) {
    subject = `${s1}`
  } else {
    subject = `one or both of ${s1} and ${s2}`
  }
  return subject
}

const ERRORS = {
  /**
   * @param {string|Object|number} c1
   * @param {string|Object|number|null} c2
   * @returns {string}
   */
  isNanError: (c1, c2=null) => `- ${subject(c1, c2)} is not a number`,

  /**
   * @param {string|Object|number} c1
   * @param {string|Object|number|null} c2
   * @returns {string}
   */
  isNanOrNotComplexError: (c1, c2=null) => `- ${subject(c1, c2)} is neither an integer nor a complex number`,

  /**
   * @param {string|Object|number} c1
   * @param {string|Object|number|null} c2
   * @returns {string}
   */
  divByZeroError: (c1, c2=null) => `- ${subject(c1, c2)} is 0: division by zero not allowed`,
}

const complex = {
  /**
   * Imaginary constant i
   * @returns {Object} complex number
   */
  Im() {
    if(!this._Im) {
      this._Im = this.create(0, 1)
    }
    return this._Im
  },
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
   * @param {Object} c1
   * @param {Object} c2
   * @returns {boolean}
   */
  equals(c1, c2) {
    if(this.isComplex(c1) && this.isComplex(c2)) {
      return c1.re === c2.re && c1.im === c2.im
    }
    else if(common.isScalar(c1) && common.isScalar(c2)) {
      return c1 === c2
    }
    else if(this.isComplex(c1) && common.isScalar(c2)) {
      if(c1.im === 0) {
        return c1.re === c2;
      }
      return false
    }
    else if(common.isScalar(c1) && this.isComplex(c2)) {
      if(c2.im === 0) {
        return c2.re === c1;
      }
      return false
    }
    else {
      throw Error(`equals ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
    }
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

  /**
   * @param {Object} c1 complex number
   * @param {Object} c2 complex number
   * @returns {Object} complex number
   */
  add(c1, c2) {
    let im, re;
    if(this.isComplex(c1) && this.isComplex(c2)) {
      re = c1.re + c2.re;
      im = c1.im + c2.im;
    }
    else if(common.isScalar(c1) && common.isScalar(c2)) {
      re = c1 + c2;
      im = 0;
    }
    else if(this.isComplex(c1) && common.isScalar(c2)) {
      re = c1.re + c2;
      im = c1.im;
    }
    else if(common.isScalar(c1) && this.isComplex(c2)) {
      re = c1 + c2.re;
      im = c2.im;
    }
    else {
      throw Error(`add ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
    }
    return this.create(re, im)
  },

  /**
   * @param {Object} c complex number
   * @param {number} s scalar
   * @returns {Object} complex number
   */
  multScalar(c, s) {
    const re = c.re * s
    const im = c.im * s
    return this.create(re, im)
  },

  /**
   * @param {Object} c1 complex number
   * @param {Object} c2 complex number
   * @returns {Object} complex number
   */
  multComplex(c1, c2) {
    const re_re = c1.re * c2.re
    const re_im = c1.re * c2.im
    const im_re = c1.im * c2.re
    const im_im = c1.im * c2.im

    const re = re_re - im_im
    const im = re_im + im_re
    return this.create(re, im)
  },

  /**
   * @param {Object} c1 complex number
   * @param {Object} c2 complex number
   * @returns {Object} complex number
   */
  mult(c1, c2) {
    if(this.isComplex(c1) && this.isComplex(c2)) {
      return this.multComplex(c1, c2)
    }
    else if(common.isScalar(c1) && common.isScalar(c2)) {
       return this.create(c1+c2, 0)
    }
    else if(this.isComplex(c1) && common.isScalar(c2)) {
      return this.multScalar(c1, c2)
    }
    else if(common.isScalar(c1) && this.isComplex(c2)) {
      return this.multScalar(c2, c1)
    }
    throw Error(`mult ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
  },

  /**
   * @param {Object} c complex number
   * @returns {Object} complex number
   */
  conjugate(c) {
    if(this.isComplex(c)) {
      return this.create(c.re, -c.im)
    }
    if(common.isScalar(c)) {
      return this.create(c, 0)
    }
    throw Error(`conjugate ${ERRORS.isNanOrNotComplexError(c)}`)
  },
  
  /**
   * @param {Object} c complex number
   * @param {number} s scalar
   * @returns {Object} complex number
   */
  divScalar(c, s) {
    if(s === 0) {
      throw Error(`divScalar ${ERRORS.divByZeroError(s)}`)
    }
    const re = c.re / s
    const im = c.im / s
    return this.create(re, im)
  },

  /**
   * @param {Object} numerator complex number
   * @param {Object} denominator complex number
   * @returns {Object} complex number
   */
  divComplex(numerator, denominator) {
    if(denominator.re === 0 && denominator.im === 0) {
      throw Error(`divComplex ${ERRORS.divByZeroError(denominator)}`)
    }
    const d_conjugate = this.conjugate(denominator)
    const num = this.multComplex(numerator, d_conjugate)
    const den = this.multComplex(denominator, d_conjugate)
    return this.create(num.re/den.re, num.im/den.re)
  },
  
  /**
   * @param {Object} c1 complex number
   * @param {Object} c2 complex number
   * @returns {Object} complex number
   */
  div(c1, c2) {
    if(this.isComplex(c1) && this.isComplex(c2)) {
      return this.divComplex(c1, c2)
    }
    else if(common.isScalar(c1) && common.isScalar(c2)) {
      return this.create(c1/c2, 0)
    }
    else if(this.isComplex(c1) && common.isScalar(c2)) {
      return this.divScalar(c1, c2)
    }
    else if(common.isScalar(c1) && this.isComplex(c2)) {
      return this.divScalar(c2, c1)
    }
    throw Error(`div ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
  },
}

module.exports = complex