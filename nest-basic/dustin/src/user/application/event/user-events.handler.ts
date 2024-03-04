import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from 'src/email/email.service';
import { UserCreatedEvent } from 'src/event/user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserEventsHandler implements IEventHandler<UserCreatedEvent> {
  constructor(@Inject('EmailService') private emailService: EmailService) {}

  async handle(event: UserCreatedEvent) {
    switch (event.name) {
      case UserCreatedEvent.name: {
        console.log('UserCreatedEvent!');
        const { email, signupVerifyToken } = event as UserCreatedEvent;
        await this.emailService.sendMemberJoinVerification(
          email,
          signupVerifyToken,
        );
        break;
      }
      default:
        break;
    }
  }
}
