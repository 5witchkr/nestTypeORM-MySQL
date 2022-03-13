import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../role-type";

export const Roles = (...roles: RoleType[]): any=>SetMetadata('roles', roles);
//유저권한관련 데코레이터