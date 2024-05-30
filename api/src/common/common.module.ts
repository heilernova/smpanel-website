import { Global, Module } from '@nestjs/common';
import { JWTService } from './jwt';
import { ConnectionDbService } from './connection-db';
import { SmpanelApiService } from './smpanel-api/smpanel-api.service';

const services = [
    JWTService,
    ConnectionDbService,
    SmpanelApiService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
