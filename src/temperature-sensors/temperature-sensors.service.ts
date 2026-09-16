import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemperatureSensor } from './entities/temperature-sensor.entity';
import { CreateTemperatureSensorDto } from './dto/create-temperature-sensor.dto';
import { UpdateTemperatureSensorDto } from './dto/update-temperature-sensor.dto';
import { TemperatureAlertsService } from './temperature-alerts.service';

@Injectable()
export class TemperatureSensorsService {
  private readonly CRITICAL_TEMP = -10;
  constructor(
    @InjectRepository(TemperatureSensor)
    private readonly temperatureSensorRepository: Repository<TemperatureSensor>,
    private readonly alertsService: TemperatureAlertsService,
  ) {}

  async create(createSensorDto: CreateTemperatureSensorDto) {
    const record = this.temperatureSensorRepository.create(createSensorDto);
    const saved = await this.temperatureSensorRepository.save(record);
    if (saved.value <= this.CRITICAL_TEMP) {
      this.alertsService.emitAlert({
        message: `Critical temperature! Value ${saved.value} ${saved.unit}`,
        temperature: saved.value,
        sensorName: saved.sensorName,
        timestamp: saved.timestamp,
        severity: 'critical'
      });
    }
    return saved;
  }
  async findAll(){
    return await this.temperatureSensorRepository.find({
      order: { createdAt: 'ASC' },
      take: 50,
    });
  }

  async findOne(id: string){
    const sensor = await this.temperatureSensorRepository.findOne({ where: { id } });
    if (!sensor) throw new NotFoundException(`Sensor with id ${id} not found`);
    return sensor;
  }

  async update (id: string, updateSensorDto: UpdateTemperatureSensorDto){
    const sensor = await this.findOne(id);
    Object.assign(sensor, updateSensorDto);
    const saved = await this.temperatureSensorRepository.save(sensor);
    if (saved.value <= this.CRITICAL_TEMP) {
      this.alertsService.emitAlert({
        message: `Critical temperature! Value ${saved.value} ${saved.unit}`,
        temperature: saved.value,
        sensorName: saved.sensorName,
        timestamp: saved.timestamp,
        severity: 'critical'
      });
    }
    return saved;
  }

  async remove(id: string){
    const sensor = await this.findOne(id);
    await this.temperatureSensorRepository.remove(sensor);
  }
}