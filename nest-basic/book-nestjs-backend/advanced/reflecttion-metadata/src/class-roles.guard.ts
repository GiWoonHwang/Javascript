import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// 클래스에 적용 됨
@Injectable()
export class ClassRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const roles = this.reflector.get<string[]>('roles', context.getClass());

    console.log('ClassRolesGuard: ', roles);

    return false; // 테스트를 위해 그냥 true를 리턴합니다.
  }
}
