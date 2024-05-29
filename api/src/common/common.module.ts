import { Global, Module } from '@nestjs/common';
import { JWTService } from './jwt';

const services = [
    JWTService
]

@Global()
@Module({
    providers: services,
    exports: services
})
export class CommonModule {}
