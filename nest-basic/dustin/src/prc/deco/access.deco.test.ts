/**
 * 접근자(get, set) 정의를 읽거나 수정할 수 있다.
 */

interface propertyDescriptor {
  configurable?: boolean; // 속성의 정의를 수정할 수 있는지 여부
  enumerable?: boolean; // 열거형인지 여부
  value?: any; // 속성 값
  writable?: boolean; // 수정 가능 여부
  get?(): any; // getter
  set?(v: any): void; // setter
}

function Enumerable(enumerable: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: propertyDescriptor,
  ) {
    descriptor.enumerable = enumerable;
  };
}

class Person {
  constructor(private name: string) {}

  /**
   * 접근자 함수의 열거 가능,불가능 여부를 설정했다.
   */
  @Enumerable(true)
  get getName() {
    return this.name;
  }

  @Enumerable(false)
  set setName(name: string) {
    this.name = name;
  }
}

const person = new Person('dustin');

for (let key in person) {
  console.log(`${key}: ${person[key]}`);
}
