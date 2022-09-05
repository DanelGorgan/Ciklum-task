import { Module } from '@nestjs/common';
import { ResourcesModule } from './resources/resources.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ResourcesModule, ConfigModule.forRoot()],
})
export class AppModule {}
