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
        //권한role정보파싱
        this.convertInAuthorities(userFind);
        //jwt
        const payload: Payload = {
            id: userFind.id,
            username: userFind.username,
            authorities: userFind.authorities,
        };
        //return값으로 accessToken
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }
    //jwt토큰인증
    async tokenValidateUser(payload: Payload): Promise<UserJwtDTO | undefined> {
        const userFind = await this.userService.findByFields({
            where: { id: payload.id }
        });
        this.flatAuthorities(userFind);
        return userFind;
    }
    //tokenValidateUser에 넣어줄함수(role)
    private flatAuthorities(user: any): UserJwtDTO {
        if(user && user.authorities) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.authorityName));
            user.authorities = authorities;
        }
        return user;
    }

    //유저권한(role)리턴값파싱함수(validateUser에 넣어줌)
    private convertInAuthorities(user: any): UserJwtDTO {
        if ( user && user.authorities) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => {
                authorities.push(authority.authorityName);
            });
            user.authorities = authorities;
        }
        return user;
    }
}
