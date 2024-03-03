import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
// import { Cron } from '@nestjs/schedule'; // @types/cron 2.4.0 에러발생, 원인파악 못함
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob(`* * * * * *`, () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);

    this.logger.warn(`job ${name} added!`);
  }

  // @Cron('* * * * * *', { name: 'cronTask' })
  // @Cron(new Date(Date.now() + 3 * 1000)) // 시간을 정의하면 한번만 실행됨
  // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_1AM)
  // handleCron() {
  //   this.logger.log('Task Called');
  // }
  /*


  // 앱일 실행된 후 3초 후에 처음 수행되고 3초마다 반복된다. 밀리세컨드 
  @Interval('intervalTask', 3000)
  handleInterval() {
    this.logger.log('Task Called by Interval');
  }

  // 테스크를 단 한번만 수행한다.
  @Timeout('timeoutTask', 5000)
  handleTimeout() {
    this.logger.log('Task Called by Timeout');
  }
  */
}
