export interface registerRequest {
    name: string;
    email: string;
    password: string;
}

export interface registerResponse {
    user_id: string;
    name: string;
    email: string;
}