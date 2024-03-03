import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// 메서드에 적용 됨
@Injectable()
export class HandlerRolesGuard implements CanActivate {
  // Reflector: 메타데이털르 다루기 위한 헬퍼 클래스
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = 'user-id'; // JWT를 검증해서 얻은 유저ID라고 가정. request.user 객체에서 얻음. 3장 참고.
    const userRole = this.getUserRole(userId);

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log('HandlerRolesGuard: ', roles);

    return roles?.includes(userRole) ?? true;
  }

  private getUserRole(userId: string): string {
    // return 'user';
    return 'admin';
  }
}
