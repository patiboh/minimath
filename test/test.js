const minimath = require('..');
const { name, version } = require('../package.json')
global.common = minimath.common // TODO: how can I do this without global?
global.complex = minimath.complex

const COMPLEX = {
  re: 0,
  im: 1,
  value: "i"
}
 

function assert(results, lib, compareFn, testFn) {
  const errors = []
  results.forEach(([actual, expected]) => {
    try {
      if(!compareFn.call(lib, actual, expected)) {
        errors.push([actual, expected])
      }
    } catch(e) {
      errors.push([e, expected])
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

  function test_isComplex() {
    const isComplex_true_actual = complex.isComplex(COMPLEX)
    const isComplex_true_expected = true
    const isComplex_false_actual = complex.isComplex(-4)
    const isComplex_false_expected = false
    const isComplex_false_string_actual = complex.isComplex("blah")
    const isComplex_false_string_expected = false
    const isComplex_true_string_actual = complex.isComplex( "5 - 4i")
    const isComplex_true_string_expected = true
    const results = [
      [isComplex_true_actual, isComplex_true_expected],
      [isComplex_false_actual, isComplex_false_expected],
      [isComplex_true_actual, isComplex_true_expected],
      [isComplex_false_string_actual, isComplex_false_string_expected],
      [isComplex_true_string_actual, isComplex_true_string_expected],
    ]
    assert(results, complex, common.equals, complex.isComplex)
  }
  test_isComplex()

  function test_create() {
    const create_actual = complex.create(5, -4)
    const create_expected_re = 5
    const create_expected_im = -4
    const create_expected_value = "5 - 4i"
    const results = [
      [i.re, COMPLEX.re],
      [i.im, COMPLEX.im],
      [i.value, COMPLEX.value],
      [create_actual.re, create_expected_re],
      [create_actual.im, create_expected_im],
      [create_actual.value, create_expected_value],
    ]
    assert(results, complex, common.equals, complex.create)
  }
  test_create()

  function test_equals() {
    const equals_actual = complex.create(5, -4)
    const equals_expected = {
      re: 5,
      im: -4,
      value: "5 - 4i"
    }
    const equals_zero_re = 0
    const equals_zero_im = {
      re: 0,
      im: 0,
      value: "0"
    }
    const results = [
      [i, COMPLEX],
      [equals_zero_re, equals_zero_im],
      [equals_actual, equals_expected],
    ]
    assert(results, complex, complex.equals, complex.equals)
  }
  test_equals()

  function test_fromString() {
    const S = B //(4+3i)
    const S_NEG = complex.create(-4,3) //(-4+3i)
    const S_CONJ = complex.create(4,-3) //(4-3i)
    const S_SCALAR = complex.create(-4,0) //(-4)
    const S1 = "4 + 3i"
    const S2 = "4+3i"
    const S3 = "-4 +3i"
    const S4 = "4- 3i"
    const S5 = "-4"
    const fromString_S1_actual = complex.fromString(S1)
    const fromString_S2_actual = complex.fromString(S2)
    const fromString_S3_actual = complex.fromString(S3)
    const fromString_S4_actual = complex.fromString(S4)
    const fromString_S5_actual = complex.fromString(S5)
    const fromString_S1_S2_expected = S
    const fromString_S3_expected = S_NEG
    const fromString_S4_expected = S_CONJ
    const fromString_S5_expected = S_SCALAR
    const results = [
      [fromString_S1_actual, fromString_S1_S2_expected],
      [fromString_S2_actual, fromString_S1_S2_expected],
      [fromString_S3_actual, fromString_S3_expected],
      [fromString_S4_actual, fromString_S4_expected],
      [fromString_S5_actual, fromString_S5_expected],
    ]
    assert(results, complex, complex.equals, complex.fromString)
  }
  test_fromString()

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

  function test_rotate() {
    const angle = Math.PI/2 // 90°
    const im = complex.Im() 
    const point = complex.create(2, 1) 
    const rotate_rotor_actual = complex.rotate(point, angle)
    const rotate_complex_plane_actual = complex.mult(point, im)
    const rotate_expected = complex.create(-1, 2)
    const results = [
      [rotate_rotor_actual, rotate_expected],
      [rotate_complex_plane_actual, rotate_expected],
    ]
    assert(results, complex, complex.equals, complex.rotate)
  }
  test_rotate()
}

console.log('Testing package - ' + name);
console.log('version ' + version);
console.log('common ');
console.log(common);
console.log('complex ');
console.log(complex);

testCommon()
testComplex()