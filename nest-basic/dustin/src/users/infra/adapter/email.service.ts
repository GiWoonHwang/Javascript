import { Injectable } from '@nestjs/common';
import { EmailService as ExternalEmailService } from 'src/email/email.service';
import { IEmailService } from 'src/users/application/adapter/iemail.service';

// 이메일 모듈은 외부 시스템이기 때문에 infra에 있어야한다. 따라서 구현체가 이곳에 위치한다.
@Injectable()
export class EmailService implements IEmailService {
  // 외부 모듈을 통해 인터페이스를 구현한다.
  constructor(private emailService: ExternalEmailService) {}

  async sendMemberJoinVerification(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    // 비동기로 처리함
    this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}
