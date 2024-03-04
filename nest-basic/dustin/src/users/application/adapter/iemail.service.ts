// 구현체를 사용하는 곳은 application의 핸들러이기 떄문에 이곳에 인터페이스를 정의한다.
export interface IEmailService {
  sendMemberJoinVerification: (email, signupVerifyToken) => Promise<void>;
}
