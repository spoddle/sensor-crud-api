import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HumiditySensor } from './entities/humidity-sensor.entity';
import { CreateHumiditySensorDto } from './dto/create-humidity-sensor.dto';
import { UpdateHumiditySensorDto } from './dto/update-humidity-sensor.dto';

@Injectable()
export class HumiditySensorsService {
  constructor(
    @InjectRepository(HumiditySensor)
    private readonly humiditySensorRepository: Repository<HumiditySensor>,
  ) {}

  async create(createHumiditySensorDto: CreateHumiditySensorDto): Promise<HumiditySensor> {
    const record = this.humiditySensorRepository.create(createHumiditySensorDto);
    return await this.humiditySensorRepository.save(record);
  }

  async findAll(): Promise<HumiditySensor[]> {
    return await this.humiditySensorRepository.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async findOne(id: string): Promise<HumiditySensor> {
    const sensor = await this.humiditySensorRepository.findOne({ where: { id } });
    if (!sensor) {
      throw new NotFoundException(`Humidity sensor with id ${id} not found`);
    }
    return sensor;
  }

  async update(
    id: string,
    updateHumiditySensorDto: UpdateHumiditySensorDto,
  ): Promise<HumiditySensor> {
    const sensor = await this.findOne(id);
    Object.assign(sensor, updateHumiditySensorDto);
    return await this.humiditySensorRepository.save(sensor);
  }

  async remove(id: string): Promise<void> {
    const sensor = await this.findOne(id);
    await this.humiditySensorRepository.remove(sensor);
  }
}