import { Global, Module } from '@nestjs/common';
import { JWTService } from './jwt';
import { ConnectionDbService } from './connection-db';

const services = [
    JWTService,
    ConnectionDbService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
