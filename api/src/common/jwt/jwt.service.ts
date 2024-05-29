import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
    private _privateKey: string;
    constructor(){
        if (existsSync('.jwt.key')){
            this._privateKey = readFileSync('.jwt.key').toString();
        } else {
            this._privateKey = crypto.randomUUID();
            writeFileSync('.jwt.key', this._privateKey);
        }
    }

    signIn<T = any>(data: T, expiresIn: string | number): string {
        return jwt.sign(data as any, this._privateKey, expiresIn ? { algorithm: 'HS256', expiresIn } : { algorithm: 'HS256' });
    }

    verify<T>(token: string): T {
        return jwt.verify(token, this._privateKey) as T;
    }
}
