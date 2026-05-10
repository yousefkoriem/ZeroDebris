import { type Telemetry } from '@/schemas/telemetry';

export function makeTelemetry(spacecraftId: string): Telemetry {
  const t = Date.now() / 1000;
  
  return {
    id: crypto.randomUUID(),
    spacecraftId,
    timestamp: Date.now(),
    altitude: 400 + Math.sin(t / 10) * 10,
    velocity: 7.66 + Math.cos(t / 10) * 0.1,
    fuelLevel: 100 - (Date.now() % 3600000) / 36000,
    batteryLevel: 50 + Math.sin(t / 100) * 50,
    temperature: 20 + Math.sin(t / 5) * 5,
    attitude: {
      pitch: Math.sin(t / 20) * 5,
      roll: Math.cos(t / 30) * 5,
      yaw: Math.sin(t / 40) * 5
    }
  };
}
