/**
 * 메서드 데커레이터는 메서드 바로 앞에 선언된다. 메서드의 속성 설명자에 적용되고 메서드의 정의를 읽거나 수정할 수 있다.
 * 선언파일, 오버로드 메서드, 선언클래스에 사용할 수 없다.
 */

interface propertyDescriptor {
  configurable?: boolean; // 속성의 정의를 수정할 수 있는지 여부
  enumerable?: boolean; // 열거형인지 여부
  value?: any; // 속성 값
  writable?: boolean; // 수정 가능 여부
  get?(): any; // getter
  set?(v: any): void; // setter
}

/**
 * 실행 결과 값
target {}
propertyKey hello
descriptor {
  value: [Function: hello],
  writable: true,
  enumerable: false,
  configurable: true
}
Error: 테스트 에러
*/
function HandleError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: propertyDescriptor,
  ) {
    console.log('target', target);
    console.log('propertyKey', propertyKey);
    console.log('descriptor', descriptor);

    const method = descriptor.value;

    descriptor.value = function () {
      try {
        method();
      } catch (e) {
        // 에러 핸들링 로직 구현
        console.log(e);
      }
    };
  };
}

class Greeter {
  @HandleError()
  hello() {
    throw new Error('테스트 에러');
  }
}

const t = new Greeter();
t.hello();
