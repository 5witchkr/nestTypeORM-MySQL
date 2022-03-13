import { EntityRepository, Repository } from "typeorm";
import { UserAuthority } from "src/domain/user-authority.entity";

@EntityRepository(UserAuthority)
export class UserAuthorityRepository extends Repository<UserAuthority> {}