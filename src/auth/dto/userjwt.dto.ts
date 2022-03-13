export class UserJwtDTO {
    id: number;
    username: string;
    password: string;
    authorities?: any[];
}