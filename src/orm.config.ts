import { TypeOrmModuleOptions } from "@nestjs/typeorm";

function ormConfig(): TypeOrmModuleOptions{
    const commonConf = {
        SYNCRONIZE: false,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: false,
    }
 
    const ormconfig: TypeOrmModuleOptions = {
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username:  process.env.MYSQL_NAME,
        password:  process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_TABLE,
        entities: commonConf.ENTITIES,
        //자동테이블생성
        synchronize: commonConf.SYNCRONIZE,
        //테이블쿼리문찍기
        logging: true,
        migrations: commonConf.MIGRATIONS,
        cli: commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN,
    }

    return ormconfig;
}

export { ormConfig }