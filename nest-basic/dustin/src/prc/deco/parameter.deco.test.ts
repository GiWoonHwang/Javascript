/**
 * 1. 정적 멤버가 속한 클래스의 생성자 함수이거나 인스턴스 멤버에 대한 클래스의 프로토타입
 * 2. 멤버의 이름
 * 3. 매개변수가 함수에서 몇 번째 위치에 선언되었는지를 나타내는 인덱스
 */

// 매개변수 제대로 전달되었는지 확인하는 데커레이터

import { BadRequestException } from '@nestjs/common';

interface propertyDescriptor {
  configurable?: boolean; // 속성의 정의를 수정할 수 있는지 여부
  enumerable?: boolean; // 열거형인지 여부
  value?: any; // 속성 값
  writable?: boolean; // 수정 가능 여부
  get?(): any; // getter
  set?(v: any): void; // setter
}

function MinLength(min: number) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    target.validator = {
      minLength: function (args: string[]) {
        return args[parameterIndex].length >= min;
      },
    };
  };
}

function Validate(
  target: any,
  propertyKey: string,
  descriptor: propertyDescriptor,
) {
  const method = descriptor.value;

  descriptor.value = function (...args) {
    Object.keys(target.validator).forEach((key) => {
      if (!target.validator[key](args)) {
        throw new BadRequestException();
      }
    });
    method.apply(this, args);
  };
}

class User {
  private name: string;

  setName(@MinLength(3) name: string) {
    this.name = name;
  }
}

const t3 = new User();

t3.setName('dustin');
console.log('---');
t3.setName('dd');
