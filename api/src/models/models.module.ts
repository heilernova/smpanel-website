import { Global, Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UserValidatorsService } from './services/user-validators/user-validators.service';
import { ServersService } from './services/servers/servers.service';

const services = [
    UsersService,
    UserValidatorsService,
    ServersService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class ModelsModule {}
