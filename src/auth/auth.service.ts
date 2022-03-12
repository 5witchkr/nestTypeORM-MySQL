import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserJwtDTO } from './dto/userjwt.dto';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async registerNewUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findByFields({
            where: { username: newUser.username }
        });
        if(userFind) {
            throw new HttpException('Username already used!', HttpStatus.BAD_REQUEST);
        }
        return await this.userService.save(newUser);
    }

    async validateUser(userDTO: UserDTO): Promise<{accessToken: string} | undefined> {
        //entitu에서 User를 가져옴...?
        let userFind: UserJwtDTO = await this.userService.findByFields({
            where: {username: userDTO.username}
        });
        const valudatePassword = await bcrypt.compare(userDTO.password, userFind.password)
        if(!userFind || !valudatePassword) {
            throw new UnauthorizedException();
        }
        //jwt
        const payload: Payload = {id: userFind.id, username: userFind.username};
        //return값으로 accessToken
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
    //jwt토큰인증
    async tokenValidateUser(payload: Payload): Promise<UserJwtDTO | undefined> {
        return await this.userService.findByFields({
            where: { id: payload.id }
        });
    }
}
