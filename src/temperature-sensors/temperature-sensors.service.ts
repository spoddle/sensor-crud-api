import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureSensor } from './entities/temperature-sensor.entity';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';

@Injectable()
export class TemperatureSensorsService {
  constructor(
    @InjectRepository(TemperatureSensor)
    private readonly temperatureSensorRepository: Repository<TemperatureSensor>,
  ) {}

  async create(createSensorDto: CreateTemperatureSensorDto): Promise<TemperatureSensor> {
    const record = this.temperatureSensorRepository.create(createSensorDto);
    return await this.temperatureSensorRepository.save(record);
  }

  async findAll(): Promise<TemperatureSensor[]> {
    return await this.temperatureSensorRepository.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async findOne(id: string): Promise<TemperatureSensor> {
    const sensor = await this.temperatureSensorRepository.findOne({ where: { id } });
    if (!sensor) {
      throw new NotFoundException(`Sensor with id ${id} not found`);
    }
    return sensor;
  }

  async update(
    id: string,
    updateSensorDto: UpdateTemperatureSensorDto,
  ): Promise<TemperatureSensor> {
    const sensor = await this.findOne(id);
    Object.assign(sensor, updateSensorDto);
    return await this.temperatureSensorRepository.save(sensor);
  }

  async remove(id: string): Promise<void> {
    const sensor = await this.findOne(id);
    await this.temperatureSensorRepository.remove(sensor);
  }
}