import { create } from 'zustand';
import type { Alert } from '@/schemas/alert';

interface AlertsState {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  clearAlert: (id: string) => void;
}

export const useAlerts = create<AlertsState>((set) => ({
  alerts: [],
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 50) })),
  clearAlert: (id) => set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
}));
