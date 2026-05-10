'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { formatDate } from '@/lib/format';
import { Badge } from '@/components/atoms/Badge';

export function MissionTimeline() {
  const { data, isLoading } = useQuery({ queryKey: ['missions'], queryFn: api.getMissions });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      {data?.map((mission) => (
        <Card key={mission.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{mission.name}</CardTitle>
                <div className="text-sm text-muted mt-1">{mission.objective}</div>
              </div>
              <Badge variant={mission.status === 'ACTIVE' ? 'success' : 'default'}>{mission.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <span className="text-muted">Start:</span> {formatDate(mission.startDate)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
