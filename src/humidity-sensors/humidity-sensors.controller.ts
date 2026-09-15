import {Controller, Get, Post, Body, Patch, Param, Delete,} from '@nestjs/common';
import { HumiditySensorsService } from './humidity-sensors.service';
import { CreateHumiditySensorDto } from './dto/create-humidity-sensor.dto';
import { UpdateHumiditySensorDto } from './dto/update-humidity-sensor.dto';

@Controller('humidity-sensors')
export class HumiditySensorsController {
  constructor(
    private readonly humiditySensorsService: HumiditySensorsService,
  ) {}

  @Post()
  async create(@Body() createHumiditySensorDto: CreateHumiditySensorDto) {
    return await this.humiditySensorsService.create(createHumiditySensorDto);
  }

  @Get()
  async findAll() {
    return await this.humiditySensorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.humiditySensorsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHumiditySensorDto: UpdateHumiditySensorDto,
  ) {
    return await this.humiditySensorsService.update(id, updateHumiditySensorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.humiditySensorsService.remove(id);
  }
}