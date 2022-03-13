import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Roles } from './decorator/role.decorator';
import { UserDTO } from './dto/user.dto';
import { RoleType } from './role-type';
import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Body() userDTO: UserDTO): Promise<any>{
    return await this.authService.registerNewUser(userDTO);
    }
    //여기서 사용된 Response는 nest의 Response가아니라 express Response이다
    @Post('login')
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        //쿠키로 전달 httpOnly는 브라우저에서 cookie를 이용할수없게만들어서 xss등의 보안을 강화
        res.cookie('jwt', jwt.accessToken, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000
        });
        return res.send({
            message: 'success'
        });
    }
    //jwt토큰 인증 req.user값을 읽어오려면 authguard로 가서 검증
    @Get('authenticate')
    @UseGuards(AuthGuard)
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }
    //admin role인지 체크
    @Get('admin-role')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    adminRoleCheck(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    @Post('logout')
    logout(@Res() res: Response): any {
        res.cookie('jwt', '', {
            maxAge: 0
        });
        return res.send({
            message: 'success'
        })
    }

    //cookie테스트
    @Get('cookies')
    getCookies(@Req() req: Request, @Res() res: Response): any {
        const jwt = req.cookies['jwt'];
        return res.send({
            message: 'cookie'
        });
    }
}
