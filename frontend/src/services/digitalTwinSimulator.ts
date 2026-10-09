import { HardwareTelemetryContract } from '../types/digitalTwin';

export class DigitalTwinSimulator {
  private seq = 1042;
  private state: HardwareTelemetryContract = {
    device_id: 'AQI-001',
    timestamp: new Date().toISOString(),
    sequence_id: 1042,
    mq135_ppm: 38.4,
    mq7_co_ppm: 2.1,
    mg811_co2_ppm: 640,
    mq2_smoke_ppm: 18.2,
    mq6_lpg_ppm: 6.5,
    gp2y1010_dust: 42.5,
    dht22_temp: 24.8,
    dht22_humidity: 58.2,
    ags10_tvoc: 185,
    buzzer_active: false,
    oled_active: true,
    aqi: 118,
    connection: 'online',
  };

  private hazardMode: 'normal' | 'smoke_spike' | 'co_danger' | 'pristine' = 'normal';

  public getSnapshot(): HardwareTelemetryContract {
    return { ...this.state };
  }

  public setHazardMode(mode: 'normal' | 'smoke_spike' | 'co_danger' | 'pristine') {
    this.hazardMode = mode;
  }

  public toggleBuzzerManual() {
    this.state.buzzer_active = !this.state.buzzer_active;
  }

  public nextTick(): HardwareTelemetryContract {
    this.seq += 1;

    let targetMq135 = 38.0;
    let targetMq7 = 2.0;
    let targetMg811 = 640;
    let targetMq2 = 18.0;
    let targetMq6 = 6.5;
    let targetDust = 42.0;
    let targetTemp = 24.8;
    let targetHum = 58.0;
    let targetTvoc = 180;

    if (this.hazardMode === 'smoke_spike') {
      targetMq2 = 145.0;
      targetDust = 188.0;
      targetMq135 = 120.0;
      targetTvoc = 640;
    } else if (this.hazardMode === 'co_danger') {
      targetMq7 = 18.5; // dangerous toxic level
      targetMq135 = 75.0;
      targetMq2 = 42.0;
    } else if (this.hazardMode === 'pristine') {
      targetDust = 8.5;
      targetMq135 = 12.0;
      targetMq7 = 0.4;
      targetMg811 = 415;
      targetMq2 = 4.0;
      targetMq6 = 1.2;
      targetTvoc = 45;
    }

    // Mean-reverting brownian perturbations
    const r = (scale: number) => (Math.random() - 0.5) * scale;

    const mq135 = +(this.state.mq135_ppm + (targetMq135 - this.state.mq135_ppm) * 0.15 + r(1.2)).toFixed(1);
    const mq7 = +(this.state.mq7_co_ppm + (targetMq7 - this.state.mq7_co_ppm) * 0.15 + r(0.15)).toFixed(1);
    const mg811 = Math.round(this.state.mg811_co2_ppm + (targetMg811 - this.state.mg811_co2_ppm) * 0.1 + r(5.0));
    const mq2 = +(this.state.mq2_smoke_ppm + (targetMq2 - this.state.mq2_smoke_ppm) * 0.18 + r(0.8)).toFixed(1);
    const mq6 = +(this.state.mq6_lpg_ppm + (targetMq6 - this.state.mq6_lpg_ppm) * 0.12 + r(0.4)).toFixed(1);
    const dust = +(this.state.gp2y1010_dust + (targetDust - this.state.gp2y1010_dust) * 0.18 + r(1.8)).toFixed(1);
    const temp = +(this.state.dht22_temp + (targetTemp - this.state.dht22_temp) * 0.05 + r(0.1)).toFixed(1);
    const hum = +(this.state.dht22_humidity + (targetHum - this.state.dht22_humidity) * 0.05 + r(0.2)).toFixed(1);
    const tvoc = Math.round(this.state.ags10_tvoc + (targetTvoc - this.state.ags10_tvoc) * 0.15 + r(8.0));

    // Dynamic AQI calculation
    // Base aqi derived from dust + CO + toxic gas weighting
    const dustAqi = (dust / 35.0) * 85;
    const coAqi = (mq7 / 4.4) * 50;
    const toxicAqi = (mq135 / 50.0) * 40;
    const computedAqi = Math.max(15, Math.min(500, Math.round(Math.max(dustAqi, coAqi) + toxicAqi * 0.3)));

    const autoBuzzer = computedAqi >= 150 || mq2 >= 100 || mq7 >= 9.0;

    this.state = {
      device_id: 'AQI-001',
      timestamp: new Date().toISOString(),
      sequence_id: this.seq,
      mq135_ppm: Math.max(1, mq135),
      mq7_co_ppm: Math.max(0.1, mq7),
      mg811_co2_ppm: Math.max(380, mg811),
      mq2_smoke_ppm: Math.max(0.5, mq2),
      mq6_lpg_ppm: Math.max(0.2, mq6),
      gp2y1010_dust: Math.max(1, dust),
      dht22_temp: temp,
      dht22_humidity: hum,
      ags10_tvoc: Math.max(10, tvoc),
      buzzer_active: autoBuzzer,
      oled_active: true,
      aqi: computedAqi,
      connection: 'online',
    };

    return { ...this.state };
  }
}

export const digitalTwinSimulator = new DigitalTwinSimulator();
