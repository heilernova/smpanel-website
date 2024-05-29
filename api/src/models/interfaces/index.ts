import { PartialBy, OmitBy } from '@app/types';

export type UserRole = 'admin' | 'user';

export interface IUserDbRow {
    id: string;
    create_at: Date;
    update_at: Date;
    role: UserRole;
    name: string;
    last_name: string;
    email: string;
    cellphone: string | null;
    permissions: string[];
    password: string;
}

export interface IUserDbRowCreate extends PartialBy<OmitBy<IUserDbRow, 'id' | 'create_at' | 'update_at'>, 'cellphone' | 'permissions'> {}

export interface IUserDbRowUpdate extends Partial<IUserDbRowCreate> {}

export interface IServerDbRow {
    id: string;
    create_at: Date;
    update_at: Date;
    user_id: string;
    url: string;
    username: string;
    token: string;
}

export interface IServerDbRowCreate extends OmitBy<IServerDbRow, 'id' | 'create_at' | 'update_at'> {}
export interface IServerDbRowUpdate extends Partial<OmitBy<IServerDbRow, 'id' | 'create_at'>> {}

export interface IServer extends OmitBy<IServerDbRow, 'user_id'> {}