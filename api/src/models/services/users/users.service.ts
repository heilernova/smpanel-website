import { ConnectionDbService } from '@app/common/connection-db';
import { Injectable } from '@nestjs/common';
import { IUserDbRow, IUserDbRowCreate, IUserDbRowUpdate } from '../../interfaces';
import { UUID } from 'crypto';
import { isEmail, isUUID } from 'class-validator';
import { hashSync } from 'bcrypt';
import { capitalize } from '@app/common/utils';

export type FilterUserOptions = { omitId: string }

@Injectable()
export class UsersService {
    constructor(private readonly _db: ConnectionDbService){}
    private parseData<T = IUserDbRowCreate | IUserDbRowUpdate>(data: IUserDbRowCreate | IUserDbRowUpdate): T {
        if (data.email) data.email = data.email.toLowerCase();
        if (data.name) data.name = capitalize(data.name);
        if (data.last_name) data.last_name = capitalize(data.last_name);
        if (data.password) data.password = hashSync(data.password, 10);
        return data as T;
    }

    async create(data: IUserDbRowCreate): Promise<IUserDbRow> {
        return (await this._db.insert<IUserDbRow>('users', this.parseData(data), '*')).rows[0];
    }

    async getAll(filter?: FilterUserOptions): Promise<IUserDbRow[]> {
        let sql: string = 'select * from users';
        let conditions: string[] = [];
        let params: any[] | undefined = [];
        if (filter?.omitId) conditions.push(`id <> $${params.push(filter.omitId)}`);
        if (conditions.length > 0){
            sql += ` where ${params.join(' and ')}`;
        }
        return (await this._db.query<IUserDbRow>(sql, params)).rows;
    }

    async get(value: string): Promise<IUserDbRow | undefined> {
        let sql: string = `select * from users where ${isUUID(value) ? 'id = $1' : (isEmail(value) ? 'email = lower($1)' : 'lower(username) = lower($1)')}`;
        return (await this._db.query<IUserDbRow>(sql, [value])).rows[0] ?? undefined;
    }

    async update(id: UUID, data: IUserDbRowUpdate): Promise<boolean> {
        return (await this._db.update('users', ['id = $1', [id]], this.parseData(data))).rowCount == 1;
    }

    async delete(id: UUID): Promise<boolean> {
        return (await this._db.delete('users', ['id = $1', [id]])).rowCount == 1;
    }
}
