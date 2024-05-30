import { AuthGuard, GetSession, Session } from '@app/auth';
import { SmpanelApiService } from '@app/common/smpanel-api';
import { IServerDbRow, ServersService } from '@app/models';
import { Controller, Get, HttpException, Param, UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard)
@Controller('servers/:serverId/users')
export class ServersUsersController {
    constructor(
        private readonly _servers: ServersService,
        private readonly _smpanelAPI: SmpanelApiService
    ){}

    @Get()
    async users(@GetSession() session: Session, @Param('serverId') serverId: string){
        let server: IServerDbRow | undefined  = await this._servers.get(serverId, { usersId: session.id });
        if (!server) throw new HttpException("Servidor no encontrado", 404);
        let api = this._smpanelAPI.prepare(server.url, server.token);
        let list: any[] = await api.users.getAll();
        return list;
    }
}
