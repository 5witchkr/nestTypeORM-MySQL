import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';
import { ormConfig } from './orm.config';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    //환경설정파일
    ConfigModule.forRoot({
      isGlobal: true
    }),
    //orm.config.ts에서 읽어옴
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    CatsModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
