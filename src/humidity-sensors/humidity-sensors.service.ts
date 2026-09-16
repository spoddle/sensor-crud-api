import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HumiditySensor } from './entities/humidity-sensor.entity';
import { CreateHumiditySensorDto } from './dto/create-humidity-sensor.dto';
import { UpdateHumiditySensorDto } from './dto/update-humidity-sensor.dto';
import { HumidityAlertsService } from './humidity-alerts.service';

@Injectable()
export class HumiditySensorsService {
  private readonly CRITICAL_HUMIDITY = 20; 
  constructor(
    @InjectRepository(HumiditySensor)
    private readonly humiditySensorRepository: Repository<HumiditySensor>,
    private readonly humidityAlertsService: HumidityAlertsService,
  ) {}

  async create(createHumiditySensorDto: CreateHumiditySensorDto): Promise<HumiditySensor> {
    const record = this.humiditySensorRepository.create(createHumiditySensorDto);
    const saved = await this.humiditySensorRepository.save(record);
    if (saved.value <= this.CRITICAL_HUMIDITY) {
      this.humidityAlertsService.emitAlert({
        message: `Critical humidity! Value ${saved.value} ${saved.unit}`,
        humidity: saved.value,
        sensorName: saved.sensorName,
        timestamp: saved.timestamp,
        severity: 'critical'
      });
    }
    return saved;
  }

  async findAll(){
    return await this.humiditySensorRepository.find({
      order: { createdAt: 'ASC' },
      take: 50,
    });
  }

  async findOne(id: string){
    const sensor = await this.humiditySensorRepository.findOne({ where: { id } });
    if (!sensor) throw new NotFoundException(`Humidity sensor with id ${id} not found`);
    return sensor;
  }

  async update(id: string, updateHumiditySensorDto: UpdateHumiditySensorDto){
    const sensor = await this.findOne(id);
    Object.assign(sensor, updateHumiditySensorDto);
    const saved = await this.humiditySensorRepository.save(sensor);
    if (sensor.value <= this.CRITICAL_HUMIDITY) {
      this.humidityAlertsService.emitAlert({
        message: `Critical humidity! Value ${sensor.value} ${sensor.unit}`,
        humidity: sensor.value,
        sensorName: sensor.sensorName,
        timestamp: sensor.timestamp,
        severity: 'critical'
      });
    }
    return saved;
  }

  async remove(id: string){
    const sensor = await this.findOne(id);
    await this.humiditySensorRepository.remove(sensor);
  }
}