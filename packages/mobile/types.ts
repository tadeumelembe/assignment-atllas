export interface ApiResponse {
    success:boolean;
    message:'string'
}

export interface IUser {
    displayName: string;
    token: string;
}