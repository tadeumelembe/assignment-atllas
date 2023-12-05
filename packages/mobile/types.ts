export interface ApiResponse {
    success:boolean;
    message:'string'
}

export interface IUser {
    username:string;
    displayName:string;
    token: string;
}