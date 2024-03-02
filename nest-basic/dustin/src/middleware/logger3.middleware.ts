import { Request, Response, NextFunction } from 'express';

// 함수로 만든 미들웨어는 의존성 DI 컨테이너를 사용할 수 없다.
export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log(`Request3...`);
  next();
}
