import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { UserRepository } from "./user.repository";
import * as bcrypt from 'bcrypt';
import { UserJwtDTO } from "./dto/userjwt.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){}

    async findByFields(options: FindOneOptions<UserDTO>): Promise<UserJwtDTO | undefined> {
        return await this.userRepository.findOne(options);
    }

    async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
        await this.transformPassword(userDTO);
        return await this.userRepository.save(userDTO);
    }
    //jwt토큰
    async transformPassword(user: UserDTO): Promise<void> {
        user.password = await bcrypt.hash(user.password, 10);
        return Promise.resolve();
    }
}