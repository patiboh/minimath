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

export const ERRORS = {
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