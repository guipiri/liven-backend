import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { AddressesModule } from './addresses/addresses.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UsersModule, DbModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
