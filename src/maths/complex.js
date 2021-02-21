// @ts-check
import * as common from './common'
import { ERRORS } from './errors'

let _Im
let _SqrtIm

/**
 * Imaginary constant i
 * @returns {Object} complex number
 */
export function Im() {
  if(!_Im) {
    _Im = create(0, 1)
  }
  return _Im
}

/**
 * Imaginary constant sqrt(i)
 * @returns {Object} complex number
 */
export function SqrtIm() {
  if(!_SqrtIm) {
    const re = 1/Math.sqrt(2)
    const im = 1/Math.sqrt(2)
    _SqrtIm = create(re, im)
  }
  return _SqrtIm
}

/**
 * @param {string|number|Object} n
 * @returns {boolean}
 */
export function isComplex(n) {
  if(typeof n === 'string') {
    try {
      const c = fromString(n)
      return isComplex(c)
    } catch (e) {
      return false
    }
  }
  if(typeof n === 'object' && n.hasOwnProperty('re') && n.hasOwnProperty('im') )  {
    return common.isScalar(n.re) && common.isScalar(n.im)
  }
  return false
}

/**
 * @param {Object} c1
 * @param {Object} c2
 * @returns {boolean}
 */
export function equals(c1, c2) {
  if(isComplex(c1) && isComplex(c2)) {
    return common.equals(c1.re, c2.re) &&  common.equals(c1.im,c2.im)
  }
  else if(common.isScalar(c1) && common.isScalar(c2)) {
    return common.equals(c1, c2)
  }
  else if(isComplex(c1) && common.isScalar(c2)) {
    if(c1.im === 0) {
      return common.equals(c1.re, c2);
    }
    return false
  }
  else if(common.isScalar(c1) && isComplex(c2)) {
    if(c2.im === 0) {
      return  common.equals(c2.re, c1);
    }
    return false
  }
  else {
    throw Error(`equals ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
  }
}

/**
 * @param {number|Object} a
 * @param {number} b
 * @returns {string}
 */
export function toString(a, b) {
  let re = a
  let im = b
  if(b === null) {
    if (common.isScalar(a)) {
      return String(a)
    }
    if(isComplex(a)) {
      re = a.re
      im = a.im
    }
    throw Error(`toString - ${ERRORS.isNanError(re, im)}`)
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
    operator = Math.sign(im) === -1 ? ' - ' : ' + '; 
    if(Math.abs(im) === 1) {
      imString= 'i'
    } else if(im !== 0) {
      imString= `${Math.abs(im)}i`
    } else {
      operator = ''
    }
  }
  return `${reString}${operator}${imString}`
}

/**
 * @param {string} s string representation of complex number: a+bi
 * @returns {Object} complex number
 */
export function fromString(s) {
  if(common.isScalar(Number(s))) {
    return create(Number(s), 0)
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
  return create(signRe*re, signOp*signIm*im)
}
  
/**
 * @param {number|null} re real part of complex number
 * @param {number|null} im imaginary part of complex number
 * @returns {Object} complex number
 */
export function create(re = null, im = null) {
  if(im === null) {
    if(re && !common.isScalar(re)) {
      throw Error(`create - ${ERRORS.isNanError(re)}`)
    }
    im = 0
  }
  if(re === null) {
    re = 0
  }
  if(!common.isScalar(re) && !common.isScalar(im)) {
    throw Error(`create - ${ERRORS.isNanError(re, im)}`)
  }
  return {
    re,
    im, // im * i
    value: toString(re, im),
  }
}

/**
 * @param {Object} c1 complex number
 * @param {Object} c2 complex number
 * @returns {Object} complex number
 */
export function add(c1, c2) {
  let im, re;
  if(isComplex(c1) && isComplex(c2)) {
    re = c1.re + c2.re;
    im = c1.im + c2.im;
  }
  else if(common.isScalar(c1) && common.isScalar(c2)) {
    re = c1 + c2;
    im = 0;
  }
  else if(isComplex(c1) && common.isScalar(c2)) {
    re = c1.re + c2;
    im = c1.im;
  }
  else if(common.isScalar(c1) && isComplex(c2)) {
    re = c1 + c2.re;
    im = c2.im;
  }
  else {
    throw Error(`add ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
  }
  return create(re, im)
}

/**
 * @param {Object} c1 complex number
 * @param {Object} c2 complex number
 * @returns {Object} complex number
 */
export function sub(c1, c2) {
  const neg = multScalar(c2, -1)
  return add(c1, neg)
}

/**
 * @param {Object} c complex number
 * @param {number} s scalar
 * @returns {Object} complex number
 */
function multScalar(c, s) {
  const re = c.re * s
  const im = c.im * s
  return create(re, im)
}

/**
 * @param {Object} c1 complex number
 * @param {Object} c2 complex number
 * @returns {Object} complex number
 */
function multComplex(c1, c2) {
  const re_re = c1.re * c2.re
  const re_im = c1.re * c2.im
  const im_re = c1.im * c2.re
  const im_im = c1.im * c2.im

  const re = re_re - im_im
  const im = re_im + im_re
  return create(re, im)
}

/**
 * @param {number|Object} c1 real or complex number
 * @param {number|Object} c2 real or complex number
 * @returns {Object} complex number
 */
export function mult(c1, c2) {
  if(isComplex(c1) && isComplex(c2)) {
    return multComplex(c1, c2)
  }
  else if(common.isScalar(c1) && common.isScalar(c2)) {
      return create(c1+c2, 0)
  }
  else if(isComplex(c1) && common.isScalar(c2)) {
    return multScalar(c1, c2)
  }
  else if(common.isScalar(c1) && isComplex(c2)) {
    return multScalar(c2, c1)
  }
  throw Error(`mult ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
}

/**
 * @param {Object} c complex number
 * @returns {Object} complex number
 */
export function conj(c) {
  if(isComplex(c)) {
    return create(c.re, -c.im)
  }
  if(common.isScalar(c)) {
    return create(c, 0)
  }
  throw Error(`conjugate ${ERRORS.isNanOrNotComplexError(c)}`)
}

/**
 * @param {Object} c complex number
 * @param {number} s scalar
 * @returns {Object} complex number
 */
function divScalar(c, s) {
  if(s === 0) {
    throw Error(`divScalar ${ERRORS.divByZeroError(s)}`)
  }
  const re = c.re / s
  const im = c.im / s
  return create(re, im)
}

/**
 * @param {Object} numerator complex number
 * @param {Object} denominator complex number
 * @returns {Object} complex number
 */
function divComplex(numerator, denominator) {
  if(denominator.re === 0 && denominator.im === 0) {
    throw Error(`divComplex ${ERRORS.divByZeroError(denominator)}`)
  }
  const d_conjugate = conj(denominator)
  const num = multComplex(numerator, d_conjugate)
  const den = multComplex(denominator, d_conjugate)
  return create(num.re/den.re, num.im/den.re)
}

/**
 * @param {number|Object} c1 real or complex number
 * @param {number|Object} c2 real or complex number
 * @returns {Object} complex number
 */
export function div(c1, c2) {
  if(isComplex(c1) && isComplex(c2)) {
    return divComplex(c1, c2)
  }
  else if(common.isScalar(c1) && common.isScalar(c2)) {
    return create(c1/c2, 0)
  }
  else if(isComplex(c1) && common.isScalar(c2)) {
    return divScalar(c1, c2)
  }
  else if(common.isScalar(c1) && isComplex(c2)) {
    return divScalar(c2, c1)
  }
  throw Error(`div ${ERRORS.isNanOrNotComplexError(c1, c2)}`)
}

/**
 * @param {number|Object} c real or complex number
 * @returns {Object} complex number
 */
export function sqrt(c) {
  if(isComplex(c)) {
    if(c.im === 0) {
      if(Math.sign(c.re) === -1) {
        return create(0, Math.sqrt(-c.re))
      }
      return create(Math.sqrt(c.re), 0)
    }
    if(c.re === 0) {
      /**
       * FORMULA:
       * sqrt(x*i) = pow((x*i),(1/2)) = pow(x,(1/2)) * pow(i,(1/2))
       */
      const sqrtIm = SqrtIm() // get root of i
      let sqrtSc // get root of scalar
      if(Math.sign(c.im) === -1) {
        sqrtSc = create(0, Math.sqrt(-c.im))
      } else {
        sqrtSc = create(Math.sqrt(c.im), 0)
      }
      // return product of roots
      return mult(sqrtIm, sqrtSc)
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
    const sign = Math.sign(c.im)

    const re_numerator = sqrt_rePow_imPow + c.re
    const re = Math.sqrt(re_numerator/2)

    const im_numerator = sqrt_rePow_imPow - c.re
    const im = sign * Math.sqrt(im_numerator/2)

    return create(re, im)
  }
  if(common.isScalar(c)) {
    if(Math.sign(c) === -1) {
      return create(0, Math.sqrt(-c))
    }
    return create(Math.sqrt(c), 0)
  }
  throw Error(`sqrt ${ERRORS.isNanOrNotComplexError(c)}`)
}

/**
 * @param {number} p exponent / power
 * @returns {Object} complex number
 */
export function powIm(p) {
  return pow(Im(), p)
}

/**
 * @param {number|Object} c real or complex number
 * @param {number} p exponent / power
 * @returns {Object} complex number
 */
export function pow(c, p) {
  if(p === 0) {
    return create(1, 0)
  }
  if(p === 1) {
    return c
  }
  return mult(c, pow(c, p-1))
}

  /**
 * Returns absolute value of a complex number (~ magnitude)
 * @param {number|Object} c real or complex number
 * @returns {number}
 */
export function abs(c) {
  if(isComplex(c)) {
    const conjugate = conj(c);
    const product = multComplex(c, conjugate)
    return sqrt(product)
  }
  if(common.isScalar(c)) {
    return create(c, 0)
  }
  throw Error(`abs ${ERRORS.isNanOrNotComplexError(c)}`)
}

/**
 * Returns rotor q = cos(o) + i*sin(o)
 * @param {number} o angle
 * @returns {Object} rotor
 */
function rotor(o) {
  if(!common.isScalar(o)) {
    throw Error(`rotor ${ERRORS.isNanError(o)}`)
  }
  return create(Math.cos(o), Math.sin(o))
}

/**
 * Rotates a point p (= number on the complex plane) by the angle o (using radians)
 * @param {number} o angle
 * @param {Object} p point
 * @returns {Object} rotated point p'
 */
export function rotate(p, o) {
  const rotorO = rotor(o)
  return mult(rotorO, p)
}
