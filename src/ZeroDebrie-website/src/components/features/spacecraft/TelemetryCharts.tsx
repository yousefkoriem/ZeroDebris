'use client';
import { useTelemetryStream } from '@/hooks/useTelemetryStream';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

export function TelemetryCharts({ spacecraftId }: { spacecraftId: string }) {
  const history = useTelemetryStream(spacecraftId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Altitude (km)</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="timestamp" tickFormatter={() => ''} stroke="rgba(255,255,255,0.3)" />
              <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.3)" />
              <Tooltip contentStyle={{ backgroundColor: '#131220', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="altitude" stroke="rgb(0, 212, 255)" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Battery Level (%)</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="timestamp" tickFormatter={() => ''} stroke="rgba(255,255,255,0.3)" />
              <YAxis domain={[0, 100]} stroke="rgba(255,255,255,0.3)" />
              <Tooltip contentStyle={{ backgroundColor: '#131220', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="batteryLevel" stroke="rgb(56, 220, 130)" dot={false} strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
