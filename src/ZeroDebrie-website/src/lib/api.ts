import { type Spacecraft } from '@/schemas/spacecraft';
import { type Telemetry } from '@/schemas/telemetry';
import { type Mission } from '@/schemas/mission';
import { type Alert } from '@/schemas/alert';

const BASE_URL = '/api';

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${url}`);
    if (!res.ok) throw new Error('API request failed');
    return res.json();
  },
  
  getSpacecrafts: () => api.get<Spacecraft[]>('/spacecrafts'),
  getSpacecraft: (id: string) => api.get<Spacecraft>(`/spacecrafts/${id}`),
  
  getTelemetry: async (id: string): Promise<Telemetry> => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/telemetry?spacecraft_id=eq.${id}&order=created_at.desc&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error('Supabase fetch failed');
    const data = await res.json();
    
    if (data && data.length > 0) {
      const raw = data[0];
      return {
        id: raw.id,
        spacecraftId: raw.spacecraft_id,
        timestamp: new Date(raw.created_at).getTime(),
        altitude: raw.altitude,
        velocity: raw.velocity,
        fuelLevel: raw.fuel_level,
        latitude: raw.latitude,
        longitude: raw.longitude,
        temperature: raw.temperature,
        // Mock fallback for fields not present in Supabase schema to prevent charts from breaking
        batteryLevel: 98.5,
        attitude: { pitch: 0.1, roll: -0.05, yaw: 0.02 }
      } as Telemetry;
    }
    
    throw new Error(`No live telemetry data found for spacecraft ${id}`);
  },

  getMissions: () => api.get<Mission[]>('/missions'),
  getAlerts: () => api.get<Alert[]>('/alerts'),
  listAlerts: () => api.get<Alert[]>('/alerts'),
  ackAlert: (id: string) => api.get<void>(`/alerts/${id}/ack`),
  listSpacecraft: () => api.getSpacecrafts(),
};
