import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export interface TemperatureAlert {
    message: string;
    temperature: number;
    sensorName: string;
    timestamp: Date;
    severity: 'critical' | 'warning';
}

@Injectable()
export class TemperatureAlertsService {
    private alertsSubject = new Subject<TemperatureAlert>();

    getAlertStream() {
        return this.alertsSubject.asObservable();
    }

    emitAlert(alert: TemperatureAlert) {
        this.alertsSubject.next(alert);
    }
}