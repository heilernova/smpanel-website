import { UUID } from "crypto";
import { ISession } from "./auth.interfaces";
import { UserRole } from "../models";

export class Session implements ISession {
    public readonly id: UUID;
    public readonly role: UserRole;
    public readonly permissions: string[];

    constructor(data: ISession){
        this.id = data.id;
        this.role = data.role;
        this.permissions = data.permissions;
    }


    checkPermissions(permissions: string[]): boolean {
        let valid: boolean = true;
        if (this.role == 'admin') return true;
        for (let i = 0; i < permissions.length; i++){
            let r: boolean = this.permissions.some(x => x == permissions[i]);
            if (!r) {
                valid = false;
                break;
            }
        }
        return valid;
    }
}