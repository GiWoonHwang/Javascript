/**
 * 클래스의 생성자에 적용되어 정의를 읽거나 수정할 수 있다.
 * 생성자를 리턴해야 한다.
 * 클래스에 reportingURL 라는 속성을 추가한다.
 * 선언 파일과 선언 클래스 내에서는 사용할 수 없다.
 */

/**
 * T extends { new (...args: any[]): {} }
 * T extends x  T는 타입 X를 확장하거나 X와 동일해야 한다.
 * { new (...args: any[]): {} }: 어떤 타입이든 상관없이, 임의의 매개변수를 받고 객체를 반환하는 생성자 함수
 * new: 생성자 함수를 의미한다
 * (...args: any[]): ...args는 나머지 매개변수 문법을 사용해, 생성자가 받을 수 있는 매개변수의 수와 타입이 가변적임을 나타냅니다.
 * : {} 생성자 함수가 반환해야 하는 객체의 타입을 나타낸다.
 */
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  return class extends constructor {
    reportingURL = 'www.naver.com';
  };
}

@reportableClassDecorator
class BugReport {
  type = 'report';
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport('Needs dark mode');

console.log(bug);
