import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAuthority } from "./user-authority.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    //유저권한관련. / eager: entity를 조회할때 join된 데이터까지 같이 가져오는 옵션
    @OneToMany(type=>UserAuthority, UserAuthority => UserAuthority.user, {eager: true})
    authorities?: any[];
}