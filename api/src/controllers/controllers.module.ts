import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ServersController } from './servers/servers.controller';

@Module({
    controllers: [
        AuthController,
        ServersController
    ]
})
export class ControllersModule {}
