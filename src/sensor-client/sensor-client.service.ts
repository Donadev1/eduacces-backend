// src/sensor/sensor.client.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SensorClientService {
  private readonly log = new Logger(SensorClientService.name);
  private readonly base = process.env.SENSOR_BASE;

  async enroll(id_persona: number): Promise<boolean> {
    const url = `${this.base}/sensor/enroll`;
    this.log.debug(`POST ${url} {"id_persona":${id_persona}}`);
    const resp = await axios
      .post(
        url,
        { id_persona },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 20000,
          validateStatus: () => true,
        },
      )
      .catch((e) => ({ status: 0, data: { error: e?.message, ok: false } }));
    this.log.debug(`ESP32 -> ${resp.status} ${JSON.stringify(resp.data)}`);
    return resp.status >= 200 && resp.status < 300 && resp.data?.ok === true;
  }

  async find() {
    const url = `${this.base}/sensor/test`;
    const resp = await axios
      .post(url, {
        timeout: 2000,
        validateStatus: () => true,
      })
      .catch((e) => ({ status: 0, data: { error: e?.message, ok: false } }));
    this.log.log(`${JSON.stringify(resp.data)}`);
    return resp.data;
  }

  async delete(id_persona: number): Promise<boolean> {
    const url = `${this.base}/sensor/delete`;
    const resp = await axios
      .post(
        url,
        { id_persona },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
          validateStatus: () => true,
        },
      )
      .catch((e) => ({ status: 0, data: { error: e?.message, ok: false } }));
    return resp.status >= 200 && resp.status < 300 && resp.data?.ok === true;
  }

  // (Opcional) leer template base64 desde el ESP32
  async readTemplateB64(id_persona: number): Promise<string | null> {
    const url = `${this.base}/sensor/template?id_persona=${id_persona}`;
    const resp = await axios
      .get(url, { timeout: 10000, validateStatus: () => true })
      .catch((e) => ({ status: 0, data: { error: e?.message, ok: false } }));
    if (
      resp.status >= 200 &&
      resp.status < 300 &&
      resp.data?.ok &&
      (resp.data as any)?.b64
    ) {
      return String((resp.data as any).b64);
    }
    return null;
  }
}
