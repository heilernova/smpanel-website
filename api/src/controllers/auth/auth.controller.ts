import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { IUserDbRow, UsersService } from '@app/models';
import { JWTService } from '@app/common/jwt';
import { compareSync } from 'bcrypt';
import { GetSession, Session } from '@app/auth';
import { CredentialsDto } from './dto/credentials.dto';

@Controller()
export class AuthController {
    constructor(
        private readonly _users: UsersService,
        public readonly _jwt: JWTService
    ){}

    @Post('sign-in')
    async signIn(@Body() credentials: CredentialsDto): Promise<any> {
        let user: IUserDbRow | undefined = await this._users.get(credentials.username);
        if (!user) throw new HttpException('Usuario no encontrado', 400);
        if (compareSync(credentials.password, user.password)) throw new HttpException('Contraseña incorrecta', 400);
        return this._jwt.signIn({
            id: user.id,
            role: user.permissions
        }, '60 days');
    }

    @Get('verify-session')
    async verifySession(@GetSession() session: Session){
        let user: IUserDbRow | undefined = await this._users.get(session.id);
        if (!user) throw new HttpException('Usuario no encontrado', 401);
        return {
            name: `${user.name} ${user.last_name}`,
            role: user.role,
            permissions: user.permissions,
            token: this._jwt.signIn({ id: user.id, role: user.permissions }, '60 days')
        }
    }
}
