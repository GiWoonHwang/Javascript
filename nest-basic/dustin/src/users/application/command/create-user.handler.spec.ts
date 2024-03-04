import * as uuid from 'uuid';
import * as ulid from 'ulid';
import { Test } from '@nestjs/testing';
import { CreateUserHandler } from './create-user.handler';
import { UserFactory } from '../../domain/user.factory';
import { UserRepository } from 'src/users/infra/db/repository/UserRepository';
import { CreateUserCommand } from './create-user.command';
import { UnprocessableEntityException } from '@nestjs/common';

// npm run test:cov

jest.mock('uuid');
jest.mock('ulid');
/**
 * spyON
 스파이를 통해 해당 메서드가 호출되었는지, 어떤 인자로 호출되었는지, 무엇을 반환했는지 등을 확인할 수 있습니다. 또한, 스파이를 통해 원래의 메서드를 호출하는 대신, 특정 값이나 에러를 반환하도록 변경할 수도 있습니다.
 */
jest.spyOn(uuid, 'v1').mockReturnValue('0000-0000-0000-0000');
jest.spyOn(ulid, 'ulid').mockReturnValue('ulid');

/**
 1. 가입된 이메일인지 확인
 2. signupVerifyToken 생성
 3. repsository save
 4. factory creatş
 */
describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler; // 본인
  let userFactory: UserFactory; // 의존 1
  let userRepository: UserRepository; // 의존 2

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(), // 모의
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(), // 모의
          },
        },
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userFactory = module.get(UserFactory);
    userRepository = module.get('UserRepository');
  });

  // 항상 같은 값을 사용하는 변수를 선언하고 재사용
  const id = ulid.ulid();
  const name = 'Dustin';
  const email = 'dustin.haan@gmail.com';
  const password = 'pass1234';
  const signupVerifyToken = uuid.v1();

  describe('execute', () => {
    it('should execute CreateUserCommand', async () => {
      // Given
      userRepository.findByEmail = jest.fn().mockResolvedValue(null); // 비동기 함수를 모킹할때 유용한다. Promise는 즉시 null로 resolve됨

      // When
      await createUserHandler.execute(
        new CreateUserCommand(name, email, password),
      );

      // Then
      expect(userRepository.save).toBeCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );
      expect(userFactory.create).toBeCalledWith(
        id,
        name,
        email,
        signupVerifyToken,
        password,
      );
    });

    it('should throw UnprocessableEntityException when user exists', async () => {
      // Given
      userRepository.findByEmail = jest.fn().mockResolvedValue({
        id,
        name,
        email,
        password,
        signupVerifyToken,
      });

      // When
      // Then
      await expect(
        createUserHandler.execute(new CreateUserCommand(name, email, password)),
      ).rejects.toThrowError(UnprocessableEntityException);
    });
  });
});
