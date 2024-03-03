import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  LogLevel,
} from '@nestjs/common';

// export class MyLogger implements LoggerService {
//   /*
//   level: error
//   level: warn
//   level: log
//   level: verbose
//   level: debug
//   */
//   log(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   error(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   warn(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   debug?(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
//   verbose?(message: any, ...optionalParams: any[]) {
//     console.log(message);
//   }
// }

@Injectable()
export class MyLogger extends ConsoleLogger {
  log(message: any, stack?: string, context?: string) {
    console.log('이은규');
    super.log.apply(this, arguments);
    this.doSomething();
  }

  private doSomething() {
    // 여기에 로깅에 관련된 부가 로직을 추가합니다.
    // ex. DB에 저장
  }
}
