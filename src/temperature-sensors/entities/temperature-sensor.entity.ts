export class TemperatureSensor { }
export interface TemperatureSensor {
  id: string;
  timestamp: Date;
  sensorName: string;
  value: number;
  unit: string;
}
