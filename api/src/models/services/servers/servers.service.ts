import { ConnectionDbService } from '@app/common/connection-db';
import { Injectable } from '@nestjs/common';
import { IServer, IServerDbRow, IServerDbRowCreate, IServerDbRowUpdate } from '../../interfaces';
import { OmitBy } from '@app/types';

@Injectable()
export class ServersService {
    constructor(
        private readonly _db: ConnectionDbService
    ){}

    forUser(userId: string): UserServers {
        return new UserServers(userId, this._db);
    }

    async create(data: IServerDbRowCreate): Promise<IServerDbRow> {
        return (await this._db.insert<IServerDbRow>('servers', data, '*')).rows[0];
    }

    async get(id: string, options?: { usersId: string }): Promise<IServerDbRow | undefined> {
        let params: any[] = [id];
        let sql: string = 'select * from servers where id = $1';
        if (options?.usersId){
            sql += ' and user_id = $2';
            params.push(options.usersId);
        }
        return (await this._db.query<IServerDbRow>(sql, params)).rows[0] ?? undefined;
    }

    async getAll(filter?: { userId?: string, url?: string, ignoreId?: string }): Promise<IServerDbRow[]> {
        let conditions: string[] = [];
        let params: any[] | undefined = [];
        let sql: string = 'select * from servers';
        if (filter?.userId) conditions.push(`user_id = $${params.push(filter.userId)}`);
        if (filter?.url) conditions.push(`url = $${params.push(filter.url)}`);
        if (filter?.ignoreId) conditions.push(`id <>> $${params.push(filter.ignoreId)}`);
        if (conditions.length > 0){
            sql += " where " + conditions.join(" and ");
        } else {
            params = undefined;
        }
        return (await this._db.query<IServerDbRow>(sql, params)).rows;
    }

    async update(id: string, data: IServerDbRowUpdate): Promise<boolean> {
        return (await this._db.update('servers', ['id = $1', [id]], data)).rowCount == 1;
    }

    async delete(id: string): Promise<boolean> {
        return (await this._db.delete('servers', ['id = $1', [id]])).rowCount == 1;
    }
    
    async urlValid(url: string): Promise<boolean> {
        return (await this._db.query('select count(*) = 0 from servers where url = $1', [url])).rowCount == 1;
    }
}


export class UserServers {
    constructor(
        private readonly _userId: string,
        private readonly _db: ConnectionDbService
    ){}

    async getAll(): Promise<IServer[]> {
        let sql: string = 'select id, create_at, update_at, url, username, token from servers where user_id = $1';
        return (await this._db.query<IServer>(sql, [this._userId])).rows;
    }
    
    async get(id: string): Promise<IServer | undefined> {
        let sql: string = 'select id, create_at, update_at, url, username, token from servers where id = $1 user_id = $2';
        return (await this._db.query(sql, [id, this._userId])).rows[0] ?? undefined;
    }

    async register(data: OmitBy<IServerDbRowCreate, 'user_id'>): Promise<IServer> {
        return (await this._db.insert<IServer, IServerDbRowCreate>('servers', {
            user_id: this._userId,
            ...data
        }, 'id, create_at, update_at, url, username, token')).rows[0];
    }

    async delete(id: string): Promise<boolean> {
        return (await this._db.delete('servers', ['id = $1 and user_id = $2', [id, this._userId]])).rowCount == 1;
    }
}