import { UUID } from "crypto";
import { UserRole } from "../models";

export interface ISession {
    id: UUID;
    role: UserRole;
    permissions: string[];
}