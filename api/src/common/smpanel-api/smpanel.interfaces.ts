export interface APIResponseData<T = any> {
    name: string;
    status_code: number;
    data: T;
    links: string[]
}

export interface AuthResponse {
    name: string;
    role: "admin" | "user";
    token: string
}