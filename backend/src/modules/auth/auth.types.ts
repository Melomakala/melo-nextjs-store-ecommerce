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

export interface loginRequest {
    email: string;
    password: string;
}

export interface loginResponse {
    user_id: string;
    name: string;
    role: string;
    email: string;
    token: string;
    refreshToken: string;
}

export interface refreshTokenRequest {
    user_id: string;
    email: string;
}

export interface refreshTokenResponse {
    token: string;
}