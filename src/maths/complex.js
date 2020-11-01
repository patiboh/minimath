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
   * Imaginary constant sqrt(i)
   * @returns {Object} complex number
   */
  SqrtIm() {
    if(!this._SqrtIm) {
      const re = 1/Math.sqrt(2)
      const im = 1/Math.sqrt(2)
      this._sqrtIm = this.create(re, im)
    }
    return this._SqrtIm
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
   * @param {string} s string representation of complex number: a+bi
   * @returns {Object} complex number
   */
  fromString(s) {
    if(common.isScalar(Number(s))) {
      return this.create(Number(s), 0)
    }
    const complexRegex = /(?<signRe>[-]{0,1})(?<re>\d+)[' ']{0,1}(?<op>[+|-]+)[' ']{0,1}(?<signIm>[-]{0,1})(?<im>\d+)(?<imString>i)/g
    const match = complexRegex.exec(s)
    if(!match) {
      throw Error(`fromString ${ERRORS.isNanOrNotComplexError(s)}`)
    }
    const tokens = match['groups']
    const re = Number(tokens.re)
    const im = Number(tokens.im)
    const signOp = tokens.op === '-' ? -1 : 1
    const signIm = tokens.signIm === '-' ? -1 : 1
    const signRe = tokens.signRe === '-' ? -1 : 1
    return this.create(signRe*re, signOp*signIm*im)
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
   * @param {Object} c1 complex number
   * @param {Object} c2 complex number
   * @returns {Object} complex number
   */
  sub(c1, c2) {
    const neg = this.multScalar(c2, -1)
    return this.add(c1, neg)
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

  /**
   * @param {Object} c complex number
   * @returns {Object} complex number
   */
  sqrt(c) {
    if(this.isComplex(c)) {
      if(c.im === 0) {
        if(common.isNeg(c.re)) {
          return this.create(0, Math.sqrt(-c.re))
        }
        return this.create(Math.sqrt(c.re), 0)
      }
      if(c.re === 0) {
        /**
         * FORMULA:
         * sqrt(x*i) = pow((x*i),(1/2)) = pow(x,(1/2)) * pow(i,(1/2))
         */
        const sqrtIm = this.SqrtIm() // get root of i
        let sqrtSc // get root of scalar
        if(common.isNeg(c.im)) {
          sqrtSc = this.create(0, Math.sqrt(-c.im))
        } else {
          sqrtSc = this.create(Math.sqrt(c.im), 0)
        }
        // return product of roots
        return this.mult(sqrtIm, sqrtSc)
      }
      
      /**
       * IDEA:
       * a + b*i = c.re + c.im*i
       * a + b*i = pow((p + q*i),2)
       * 
       * We want to know p & q
       * 
       * FORMULA:
       * sqrt(a + b*i) = 
       *  sqrt((sqrt(pow(a,2) + pow(b,2)) + a)/2) 
       *  + 
       *  i * sqrt((sqrt(pow(a,2) + pow(b,2)) - a)/2)
       */
      const rePow = Math.pow(c.re,2)
      const imPow = Math.pow(c.im,2)
      const sqrt_rePow_imPow = Math.sqrt(rePow + imPow)
      const sign = common.isNeg(c.im) ? -1 : 1

      const re_numerator = sqrt_rePow_imPow + c.re
      const re = Math.sqrt(re_numerator/2)

      const im_numerator = sqrt_rePow_imPow - c.re
      const im = sign * Math.sqrt(im_numerator/2)

      return this.create(re, im)
    }
    if(common.isScalar(c)) {
      if(common.isNeg(c)) {
        return this.create(0, Math.sqrt(-c))
      }
      return this.create(Math.sqrt(c), 0)
    }
    throw Error(`sqrt ${ERRORS.isNanOrNotComplexError(c)}`)
  },

  /**
   * @param {number} p exponent / power
   * @returns {Object} complex number
   */
  powIm(p) {
    return this.pow(this.Im(), p)
  },
  /**
   * @param {Object} c complex number
   * @param {number} p exponent / power
   * @returns {Object} complex number
   */
  pow(c, p) {
    if(p === 0) {
      return this.create(1, 0)
    }
    if(p === 1) {
      return c
    }
    return this.mult(c, this.pow(c, p-1))
  },

    /**
   * Returns absolute value of a complex number (~ magnitude)
   * @param {Object} c complex number
   * @returns {number}
   */
  abs(c) {
    if(this.isComplex(c)) {
      const conjugate = this.conjugate(c);
      const product = this.multComplex(c, conjugate)
      return this.sqrt(product)
    }
    if(common.isScalar(c)) {
      if(common.isNeg(c)) {
        return this.create(-c, 0)
      }
      return this.create(c, 0)
    }
    throw Error(`abs ${ERRORS.isNanOrNotComplexError(c)}`)
  },
}

module.exports = complex