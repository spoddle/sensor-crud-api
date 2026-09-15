import {Controller, Get, Post, Body, Patch, Param, Delete,} from '@nestjs/common';
import { TemperatureSensorsService } from './temperature-sensors.service';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';

@Controller('temperature-sensors')
export class TemperatureSensorsController {
  constructor(
    private readonly temperatureSensorsService: TemperatureSensorsService,
  ) {}

  @Post()
  async create(@Body() createTemperatureSensorDto: CreateTemperatureSensorDto) {
    return await this.temperatureSensorsService.create(createTemperatureSensorDto);
  }

  @Get()
  async findAll() {
    return await this.temperatureSensorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.temperatureSensorsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTemperatureSensorDto: UpdateTemperatureSensorDto,
  ) {
    return await this.temperatureSensorsService.update(id, updateTemperatureSensorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.temperatureSensorsService.remove(id);
  }
}