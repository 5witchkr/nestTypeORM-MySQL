import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    async registerAccount(@Req() req: Request, @Body() userDTO: UserDTO): Promise<any>{
    return await this.authService.registerNewUser(userDTO);
    }
    //여기서 사용된 Response는 nest의 Response가아니라 express Response이다
    @Post('login')
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        return res.json(jwt);
    }
}
