/**
 * 기본
 */
function deco(tartget: any, propertyKey: string, descriptor: any) {
  console.log('데코레이터 평가됨');
}

/**
 * 데코레이터에 인수를 넘겨서 동작을 변경하기
 */
function decoFac(value: string) {
  console.log('데코레이터 평가됨');
  return function deco(tartget: any, propertyKey: string, descriptor: any) {
    console.log(value);
  };
}

/**
 * 데코레이터 합성하기
 * 표현안 위에서 아래
 * 결과는 아래에서 위
 */
function first() {
  console.log('first(): factory evaluated');
  return function deco(tartget: any, propertyKey: string, descriptor: any) {
    console.log('first(): called');
  };
}

function second() {
  console.log('second(): factory evaluated');
  return function deco(tartget: any, propertyKey: string, descriptor: any) {
    console.log('second(): called');
  };
}

class ExampleClass {
  @first()
  @second()
  method() {
    console.log('method is called');
  }
}

const e = new ExampleClass();
e.method();

class TestClass {
  @decoFac('hello')
  test() {
    console.log('함수 호출됨');
  }
}

const decoTest = new TestClass();
decoTest.test();
