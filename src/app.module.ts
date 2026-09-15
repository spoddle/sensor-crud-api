import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TemperatureSensorsModule } from './temperature-sensors/temperature-sensors.module';
import { TemperatureSensor } from './temperature-sensors/entities/temperature-sensor.entity';
import { HumiditySensorsModule } from './humidity-sensors/humidity-sensors.module';
import { HumiditySensor } from './humidity-sensors/entities/humidity-sensor.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [TemperatureSensor, HumiditySensor],
        synchronize: false, 
        ssl: {
          rejectUnauthorized: false, 
        },
      }),
    }),

    TemperatureSensorsModule,
    HumiditySensorsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}