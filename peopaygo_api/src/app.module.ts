import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { TimesheetModule } from './timesheet/timesheet.module';
import UserModule from './users/user.module';
import AuthModule from './auth/auth.module';
import EmployeeModule from './employee/employee.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenInterceptor } from './utils/global-filter';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UserModule,
    EmployeeModule,
    AuthModule,
    TimesheetModule
  ],
  controllers: [AppController],
  providers: [AppService,
    //   {
    //   provide: APP_INTERCEPTOR,
    //   useClass: AccessTokenInterceptor,
    // }
  ],
})
export class AppModule { }
