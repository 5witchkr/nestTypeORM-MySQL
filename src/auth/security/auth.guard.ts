import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard as NestAuthGurad } from "@nestjs/passport";
import { Observable } from "rxjs";

//auth가드가 canactivate한지 물어봄
@Injectable()
export class AuthGuard extends NestAuthGurad('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }
}