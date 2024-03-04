import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { UserCreatedEvent } from 'src/event/user-created.event';
import { User } from './user';

/**
 * 유저 객체를 생성할 때, 유저가 생성되었다는 이벤트를 발생시켜야 한다.
 * 발생시키는 주체는 유처 객체가 되는게 적합하지만, 유저 클레스는 new를 통해 생성되기 때문에 eventBus를 주입받을 수 없다.
 * 따라서 User를 생성하는 팩토리 클래스를 만들어 프로바이더로 제공한다.
 */
@Injectable()
export class UserFactory {
  constructor(private eventBus: EventBus) {}

  create(
    id: string,
    name: string,
    email: string,
    signupVerifyToken: string,
    password: string,
  ): User {
    const user = new User(id, name, email, password, signupVerifyToken);

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));

    return user;
  }

  // reconstitute(
  //   id: string,
  //   name: string,
  //   email: string,
  //   signupVerifyToken: string,
  //   password: string,
  // ): User {
  //   return new User(id, name, email, password, signupVerifyToken);
  // }
}
