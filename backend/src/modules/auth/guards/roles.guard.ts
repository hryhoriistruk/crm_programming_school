import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { errorMessages } from '../../../common/constants/error-messages.constant';
import { EUserRole } from '../../../database/entities/enums/user-role.enum';
import { ROLES } from '../constants/constants';
import { IUserData } from '../interfaces/user-data.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<EUserRole[]>(ROLES, context.getHandler());
    if (!roles) {
      throw new UnauthorizedException(errorMessages.ACCESS_DENIED_USER_ROLE);
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user as IUserData;

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException(errorMessages.ACCESS_DENIED_USER_ROLE);
    }
    return true;
  }
}
