const common = require('./maths/common')
const complex = require('./maths/complex')

const COMPLEX = {
  re: 0,
  im: 1,
  value: "i"
}

function assert(results, lib, compareFn, testFn) {
  const errors = []
  results.forEach(([actual, expected]) => {
    if(!compareFn.call(lib, actual, expected)) {
      errors.push([actual, expected])
    } 
  })
  if(errors.length > 0) {
    console.log(`❌ ${testFn.name} fail`);

    errors.forEach(([actual, expected])=> {
      console.log(`${testFn.name} actual:  ${actual.value ? actual.value : actual}`);
      console.log(`${testFn.name} expected:  ${expected.value ? expected.value : expected}`);
    })
  } else {
    console.log(`✅ ${testFn.name} OK`);
  }
}

function testCommon() {
  console.log(`\n---------------`);
  console.log(`Module: common`);
  console.log(`---------------`);

  function test_isScalar() {
    const scalarZero = 0
    const scalarInt = 1
    const scalarIntNeg = -5
    const scalarFloat = 4.13
    const scalarFloatNeg = -5.64
    const scalarQuotient = 5/3
    const scalarQuotientNeg = -5/6
    const complex = COMPLEX
    const isScalar_scalarZero_actual = common.isScalar(scalarZero)
    const isScalar_scalarZero_expected = true
    const isScalar_scalarInt_actual = common.isScalar(scalarInt)
    const isScalar_scalarInt_expected = true
    const isScalar_scalarIntNeg_actual = common.isScalar(scalarIntNeg)
    const isScalar_scalarIntNeg_expected = true
    const isScalar_scalarFloat_actual = common.isScalar(scalarFloat)
    const isScalar_scalarFloat_expected = true
    const isScalar_scalarFloatNeg_actual = common.isScalar(scalarFloatNeg)
    const isScalar_scalarFloatNeg_expected = true
    const isScalar_scalarQuotient_actual = common.isScalar(scalarQuotient)
    const isScalar_scalarQuotient_expected = true
    const isScalar_scalarQuotientNeg_actual = common.isScalar(scalarQuotientNeg)
    const isScalar_scalarQuotientNeg_expected = true
    const isScalar_complex_actual = common.isScalar(complex)
    const isScalar_complex_expected = false

    const results = [
      [isScalar_scalarInt_actual, isScalar_scalarInt_expected],
      [isScalar_scalarIntNeg_actual, isScalar_scalarIntNeg_expected],
      [isScalar_scalarFloat_actual, isScalar_scalarFloat_expected],
      [isScalar_scalarFloatNeg_actual, isScalar_scalarFloatNeg_expected],
      [isScalar_scalarQuotient_actual, isScalar_scalarQuotient_expected],
      [isScalar_scalarQuotientNeg_actual, isScalar_scalarQuotientNeg_expected],
      [isScalar_complex_actual, isScalar_complex_expected],
      [isScalar_scalarZero_actual, isScalar_scalarZero_expected],
    ]
    assert(results, common, common.equals, common.isScalar)
  }
  test_isScalar()
}

function testComplex() {
  console.log(`\n---------------`);
  console.log(`Module: complex`);
  console.log(`---------------`);

  const i = complex.Im()
  const iNeg = complex.create(0, -1)
  const complexZero = complex.create(0, 0)
  const A = complex.create(0,6)
  const B = complex.create(4,3) //(4+3i)
  const BNeg = complex.create(-4,-3) //(-4-3i)
  const B2 = complex.create(7,24) //(4+3i)*(4+3i)
  const B3 = complex.create(-44,117) //(4+3i)*(4+3i)*(4+3i)
  const B4 = complex.create(-527, 336) // (4+3i)*(4+3i)*(4+3i)*(4+3i)
  const B5 = complex.create(-3116, -237) // (4+3i)*(4+3i)*(4+3i)*(4+3i)*(4+3i)
  const C = complex.create(2,1)
  const G = complex.create(8,-6)

  const M_POS = complex.create(12,9) //3*(4+3i)
  const M_NEG = complex.create(-12,-9) //-3*(4+3i)
  const POS = 3
  const NEG = -3

  function test_create() {
    const create_actual = complex.create(5, -4)
    const create_expected_re = 5
    const create_expected_im = -4
    const create_expected_value = "5 - 4i"
    const results = [
      [create_actual.re, create_expected_re],
      [create_actual.im, create_expected_im],
      [create_actual.value, create_expected_value],
    ]
    assert(results, complex, common.equals, complex.create)
  }
  test_create()

  function test_add() {
    const add_i_A_actual = complex.add(i, A)
    const add_i_A_expected = complex.create(0, 7)
    const add_A_B_actual = complex.add(A, B)
    const add_A_B_expected = complex.create(4, 9)
    const add_i_zero_actual = complex.add(i, 0)
    const add_i_zero_expected = i
    const add_i_iNeg_actual = complex.add(i, iNeg)
    const add_i_iNeg_expected = complexZero
    const add_B_BNeg_actual = complex.add(B, BNeg)
    const add_B_BNeg_expected = 0

    const results = [
      [add_i_A_actual, add_i_A_expected],
      [add_A_B_actual, add_A_B_expected],
      [add_i_zero_actual, add_i_zero_expected],
      [add_i_iNeg_actual, add_i_iNeg_expected],
      [add_B_BNeg_actual, add_B_BNeg_expected],
    ]
    assert(results, complex, complex.equals, complex.add)
  }
  test_add()

  function test_mult() {
    const mult_i_C_actual = complex.mult(i, C)
    const mult_i_C_expected = complex.create(-1, 2)
    const mult_B_B2_actual = complex.mult(B, B2)
    const mult_B_B2_expected = B3
    const mult_B_POS_actual = complex.mult(B, POS)
    const mult_B_POS_expected = M_POS
    const mult_B_NEG_actual = complex.mult(B, NEG)
    const mult_B_NEG_expected = M_NEG

    const results = [
      [mult_i_C_actual, mult_i_C_expected],
      [mult_B_B2_actual, mult_B_B2_expected],
      [mult_B_POS_actual, mult_B_POS_expected],
      [mult_B_NEG_actual, mult_B_NEG_expected],
    ]
    assert(results, complex, complex.equals, complex.mult)
  }
  test_mult()

  // TODO test more + div by zero
  function test_div() {
    const div_A_B_actual = complex.div(A, B)
    const div_A_B_expected = complex.create(0.72, 0.96)
    const results = [
      [div_A_B_actual, div_A_B_expected],
    ]
    assert(results, complex, complex.equals, complex.div)
  }
  test_div()

  function test_sqrt() {
    const sqrt_G_actual = complex.sqrt(G)
    const sqrt_G_expected = complex.create(3, -1)
    const results = [
      [sqrt_G_actual, sqrt_G_expected],
    ]
    assert(results, complex, complex.equals, complex.sqrt)
  }
  test_sqrt()

  function test_pow() {
    const pow_2_actual = complex.pow(B, 2)
    const pow_3_actual = complex.pow(B, 3)
    const pow_4_actual = complex.pow(B, 4)
    const pow_5_actual = complex.pow(B, 5)
    const pow_3_expected = B3
    const pow_2_expected = B2
    const pow_4_expected = B4
    const pow_5_expected = B5
    const results = [
      [pow_2_actual, pow_2_expected],
      [pow_3_actual, pow_3_expected],
      [pow_4_actual, pow_4_expected],
      [pow_5_actual, pow_5_expected],
    ]
    assert(results, complex, complex.equals, complex.pow)
  }  test_pow()

  function test_abs() {
    const abs_G_actual = complex.abs(G)
    const abs_G_expected = complex.create(10, 0)
    const results = [
      [abs_G_actual, abs_G_expected],
    ]
    assert(results, complex, complex.equals, complex.abs)
  }
  test_abs()

}

testCommon()
testComplex()