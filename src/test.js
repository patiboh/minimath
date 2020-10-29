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
}

testCommon()
testComplex()