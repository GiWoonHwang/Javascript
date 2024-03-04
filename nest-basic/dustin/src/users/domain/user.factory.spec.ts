import { Test } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { UserFactory } from './user.factory';
import { User } from './user';

/**
 * describe: 테스트 스위트를 작성하는 블록이다. (의미 있는 단위로 묶은 것)
 * it: 특정 테스트 시나리오를 작성
 * BDD 방식으로 진행한다.
 */
describe('UserFactory', () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>;

  // 모듈을 가져오는 것은 한 번만 이루어지면 되므로 beforeAll에서 수행한다.
  beforeAll(async () => {
    // 테스트 모듈을 생성해 사용한다. 모듈을 임포트 할때와 동일하게 컴포넌트를 가져올 수 있다.
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(), // 어떤 동작도 하지 않는 함수
          },
        },
      ],
    }).compile();

    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    // 깜빡하고 it 안쓰면 에러난다..
    it('should create user', () => {
      // Given
      // When
      const user = userFactory.create(
        'user-id',
        'Dustin',
        'dustin.haan@gmail.com',
        'signup-verify-token',
        'pass123444',
      );
      // Then
      const expected = new User(
        'user-id',
        'Dustin',
        'dustin.haan@gmail.com',
        'pass123444',
        'signup-verify-token',
      );
      expect(expected).toEqual(user);

      expect(eventBus.publish).toBeCalledTimes(1); // eventBus.publish 함수가 1번 호출되었는지 판단.
    });
  });
  describe('reconsitute', () => {
    it('should reconstitute user', () => {
      // Given
      // When
      const user = userFactory.reconstitute(
        'user-id',
        'Dexter',
        'dexter.haan@gmail.com',
        'pass1234',
        'signup-verify-token',
      );

      // Then
      const expected = new User(
        'user-id',
        'Dexter',
        'dexter.haan@gmail.com',
        'signup-verify-token',
        'pass1234',
      );
      expect(expected).toEqual(user);
    });
  });
});
