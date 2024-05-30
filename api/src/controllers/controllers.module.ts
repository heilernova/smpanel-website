import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ServersController } from './servers/servers.controller';
import { ServersUsersController } from './servers-users/servers-users.controller';

@Module({
    controllers: [
        AuthController,
        ServersController,
        ServersUsersController
    ]
})
export class ControllersModule {}
