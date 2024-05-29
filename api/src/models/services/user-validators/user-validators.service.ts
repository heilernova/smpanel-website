import { ConnectionDbService } from '@app/common/connection-db';
import { Injectable } from '@nestjs/common';
import { UUID } from '@smpanel/types';

@Injectable()
export class UserValidatorsService {
    constructor(private readonly _db: ConnectionDbService){}

    async emailValid(email: string, ignore: UUID): Promise<boolean> {
        let params: any[] = [email];
        let sql: string = 'select count(*) = 0 from users where email = $1';
        if (ignore){
            sql += ` and id <> $2`;
            params.push(ignore);
        }
        return (await this._db.query<[boolean]>(sql, params)).rowCount == 1;
    }

}
