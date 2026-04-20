export interface LogMeta {
    user_id?: string;
    request_id?: string;
    service?: string;
    [key: string]: any;
}