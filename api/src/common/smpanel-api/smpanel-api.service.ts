import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from "axios";
import { AuthResponse } from './smpanel.interfaces';
type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';

const httpSend = async <T = any>(url: string, method: Method, options: { body?: any, token?: string  }): Promise<AxiosResponse<T>> => {
    try {
        let res = await axios({ url: url, method: method, data: options.body, headers: { 'app-token': options.token } });
        (res as any).data = res.data.data;
        return res as any;
    } catch (error: any) {
        if (error.response){
            if (error.response.status == 500) throw new HttpException(`Error con el servidor ${url}`, 400);
            if (error.response.status == 400) throw new HttpException(`El servidor ${url} dice: ${error.response.data.message}`, 400);
        }

        if (error.request){
            throw new HttpException(`No hubo respuesta por parte del servidor ${url}`, 400);
        }

        throw new HttpException("Error inesperado", 500);
    }
}

@Injectable()
export class SmpanelApiService {
    constructor(){}
    
    async signIn(url: string, username: string, password: string): Promise<AuthResponse> {
        let result = await httpSend<AuthResponse>(url, 'POST', { body:  { hostname: "SM Panel Website API", username, password }});
        return result.data;
    }

    prepare(url: string, token: string){
        return new SMPanelAPI(url, token);
    }
}


export class SMPanelAPI {

    public readonly profile: {
        getInfo: () => Promise<any>,
        update: (data: any) => Promise<any>,
        updatePassword: (data: any) => Promise<any>
    }

    public readonly users: {
        getAll: () => Promise<any>,
        create: (data: any) => Promise<any>,
        update: (id: string, data: any) => Promise<any>,
        delete: (id: string) => Promise<any>,
        resetPassword: (id: string) => Promise<any>
    }

    public readonly applications!: {
        getAll: () => Promise<any>,
        create: (data: any) => Promise<any>,
        update: (id: string, data: any) => Promise<any>,
        delete: (id: string) => Promise<any>,
        assignUser: (appId: string, userId: string, permissions: string[]) => Promise<any>,
        removeUser: (appId: string, userId: string) => Promise<any>,
        changePermissionsUser: (appId: string, userId: string, permissions: string[]) => Promise<any>,
    };

    constructor(url: string, token: string){

        this.profile = {
            getInfo: () => httpSend(url, 'GET', { token }),
            update: (data: any) => httpSend(url, 'PUT', { body: data, token }),
            updatePassword: (data: any) => httpSend(url, 'PUT', { body: data, token })
        }

        this.users = {
            getAll: () => httpSend(`${url}/users`, 'GET', { token }),
            create: (data: any) => httpSend(`${url}/users`, 'POST', { token }),
            update: (id: string, data: any) => httpSend(`${url}/users/${id}`, 'PUT', { token }),
            delete: (id: string) => httpSend(`${url}/users/${id}`, 'DELETE', { token }),
            resetPassword: (id: string) => httpSend(`${url}/users/{${id}}/reset-password`, 'PUT', { token })
        }

        this.applications = {
            getAll: () => httpSend(`${url}/applications`, 'GET', { token }) ,
            create: (data: any) => httpSend(`${url}/applications`, 'POST', { body: data, token }),
            update: (id: string, data: any) => httpSend(`${url}/applications/${id}`, 'PUT', { body: data, token }),
            delete: (id: string) => httpSend(`${url}/applications/${id}`, 'DELETE', { token }),
            assignUser: (appId: string, userId: string, permissions: string[]) => httpSend(`${url}/applications/${appId}/users`, 'POST', { body: { userId: userId, permissions: permissions }, token }),
            removeUser: (appId: string, userId: string) => httpSend(`${url}/applications/${appId}/users/${userId}`, 'DELETE', { token }),
            changePermissionsUser: (appId: string, userId: string, permissions: string[]) => httpSend(`${url}/applications/${appId}/users/${userId}`, 'PUT', { token }) 
        }
        
    }
}

