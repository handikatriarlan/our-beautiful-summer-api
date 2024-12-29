import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemoriesModule } from './memories/memories.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MemoriesModule,
  ],
})
export class AppModule {}
