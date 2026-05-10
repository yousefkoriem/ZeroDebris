'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

export function ScheduleList() {
  return (
    <Card>
      <CardHeader><CardTitle>Upcoming Passes</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <div className="text-sm font-medium">AOS Station Alpha</div>
              <div className="text-xs text-muted">10:45:00 UTC</div>
            </div>
            <div className="text-sm text-cyan-500">In 12m</div>
          </div>
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <div className="text-sm font-medium">LOS Station Alpha</div>
              <div className="text-xs text-muted">10:58:00 UTC</div>
            </div>
            <div className="text-sm text-muted">In 25m</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
