import { User } from '../user';

/**
 * 엔티티 클래스는 infra 레이어에 존재하지만 어플리케이션 레이어에 있는 모든 핸들러가 사용하고 있다. 따라서 의존성 방향이 반대로 되어있다.
 * 의존성 반향 문제를 해결하기 위해 데이터 유저 정보를 다루는 IUserRepository를 도메인에서 선언한다.
 * IUserRepository를 도메인 레이어에서 구현하는 이유는 어느 레이어에서든 사용할 가능성이 있기 때문이다.
 */

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User>;
  findByEmailAndPassword: (email: string, password: string) => Promise<User>;
  findBySignupVerifyToken: (signupVerifyToken: string) => Promise<User>;
  save: (
    id: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}
