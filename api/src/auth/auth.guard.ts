import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { ISession } from './auth.interfaces';
import { Request } from 'express';
import { Session } from './session';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './permissions.decorator';
import { ConnectionDbService } from '@app/common/connection-db';
import { JWTService } from '@app/common/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _db: ConnectionDbService,
    private reflector: Reflector,
    private readonly _jwt: JWTService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    let token = context.switchToHttp().getRequest<Request>().headers['authorization'];
    if (typeof token == 'string') {
      let jwt: string = token.split(' ')[1];
      
      try {
        let data = this._jwt.verify<ISession>(jwt);
        let session = new Session(data);
        context.switchToHttp().getRequest<Request&{ appSession: Session }>().appSession = session;

            const requiredPermissions: string[] | undefined | null = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
      
          if (requiredPermissions && requiredPermissions.length > 0){
            return session.checkPermissions(requiredPermissions);
          }
          return true;
      } catch (error) {
        throw new HttpException('Token invalido', 401);    
      }
    }
    throw new HttpException('Se require autenticación', 401);
  }
}
