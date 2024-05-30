import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ServersService } from '@app/models';
import { AuthGuard, GetSession, Session } from '@app/auth';
import { RegisterServerDto } from './dto/register-server.dto';
import { SmpanelApiService } from '@app/common/smpanel-api';

@UseGuards(AuthGuard)
@Controller('servers')
export class ServersController {
    constructor(
        private readonly _servers: ServersService,
        private readonly _smpanelAPI: SmpanelApiService
    ){}

    @Post()
    async register(@GetSession() session: Session, @Body() body: RegisterServerDto){
        let res = await this._servers.getAll({ userId: session.id, url: body.url });
        if (res.length > 0){
            throw new HttpException("Ya tienes un servidor registrado con esa URL", 400);
        }
        let auth = await this._smpanelAPI.signIn(body.url, body.username, body.password);
        let server = await this._servers.create({
            user_id: session.id,
            url: body.url,
            role: auth.role,
            username: body.username,
            token: auth.token,
        });

        return {
            id: server.id,
            create_at: server.create_at,
            url: server.url,
            username: server.username
        }
    }

    @Get()
    async getAll(@GetSession() session: Session){
        return (await this._servers.getAll({ userId: session.id })).map(server => {
            return {
                id: server.id,
                create_at: server.create_at,
                url: server.url,
                username: server.username
            }
        })
    }

    @Put(':id')
    async update(@GetSession() session: Session, @Param('id') id: string, @Body() body: RegisterServerDto){
        let res = await this._servers.getAll({ userId: session.id, url: body.url, ignoreId: id });
        if (res.length > 0){
            throw new HttpException("Ya tienes un servidor registrado con esa URL", 400);
        }

        let auth = await this._smpanelAPI.signIn(body.url, body.username, body.password);
        await this._servers.update(id, { url: body.url, username: body.username, role: auth.role, token: auth.token });
    }

    @Delete(':id')
    async delete(@GetSession() session: Session, @Param('id') id: string){
        let list = await this._servers.getAll({ userId: session.id });
        let server = list.find(x => x.id == id);
        if (!server) throw new HttpException('Servidor no encontrado', 404);
        await this._servers.delete(id);
    }

}
