import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SensorClientService {
  private readonly logger = new Logger(SensorClientService.name);
  private readonly base = process.env.SENSOR_BASE || 'http://192.168.65.27'; // p.ej. http://192.168.1.120

  async enroll(id_persona: number): Promise<boolean> {
    try {
      const url = `${this.base}/sensor/enroll`;
      this.logger.debug(`POST ${url} body={"id_persona":${id_persona}}`);
      const { status, data } = await axios.post<{ ok: boolean }>(
        url,
        { id_persona },
        {
          timeout: 120000, // 120s porque el enrolamiento espera dedo
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true,
        },
      );
      this.logger.debug(
        `ESP32 RESP -> status=${status} data=${JSON.stringify(data)}`,
      );
      return status >= 200 && status < 300 && data?.ok === true;
    } catch (e: any) {
      this.logger.error(`Enroll error: ${e?.message}`);
      return false;
    }
  }

  async delete(id_persona: number): Promise<boolean> {
    try {
      const url = `${this.base}/sensor/delete`;
      this.logger.debug(`POST ${url} body={"id_persona":${id_persona}}`);
      const { status, data } = await axios.post<{ ok: boolean }>(
        url,
        { id_persona },
        {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json' },
          validateStatus: () => true,
        },
      );
      this.logger.debug(
        `ESP32 RESP -> status=${status} data=${JSON.stringify(data)}`,
      );
      return status >= 200 && status < 300 && data?.ok === true;
    } catch (e: any) {
      this.logger.error(`Delete error: ${e?.message}`);
      return false;
    }
  }
}
