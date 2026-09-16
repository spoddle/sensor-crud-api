import {Controller, Get, Post, Body, Patch, Param, Delete, Sse, MessageEvent} from '@nestjs/common';
import { HumiditySensorsService } from './humidity-sensors.service';
import { CreateHumiditySensorDto } from './dto/create-humidity-sensor.dto';
import { UpdateHumiditySensorDto } from './dto/update-humidity-sensor.dto';
import { HumidityAlertsService } from './humidity-alerts.service';
import { Observable, map } from 'rxjs';

@Controller('humidity-sensors')
export class HumiditySensorsController {
  constructor(
    private readonly HumiditySensorsService: HumiditySensorsService,
    private readonly HumidityAlertsService: HumidityAlertsService,
  ) {}

  @Post()
  create(@Body() createHumiditySensorDto: CreateHumiditySensorDto) {
    return this.HumiditySensorsService.create(createHumiditySensorDto);
  }

  @Get()
  findAll() {
    return  this.HumiditySensorsService.findAll();
  }
  
  @Sse('alerts')
  getAlerts(): Observable<MessageEvent> {
    return this.HumidityAlertsService.getAlertStream().pipe(
      map((alert) => ({
        data: alert,
      })),
    );
  }

  @Get(':id')
   findOne(@Param('id') id: string) {
    return this.HumiditySensorsService.findOne(id);
  }

  @Patch(':id')
   update(
    @Param('id') id: string,
    @Body() updateHumiditySensorDto: UpdateHumiditySensorDto,
  ) {
    return this.HumiditySensorsService.update(id, updateHumiditySensorDto);
  }

  @Delete(':id')
   remove(@Param('id') id: string) {
    return this.HumiditySensorsService.remove(id);
  }
}