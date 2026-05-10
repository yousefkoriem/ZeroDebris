import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/spacecrafts', () => {
    return HttpResponse.json([
      { id: '1', name: 'Egypt Observer-1', status: 'NOMINAL', missionId: 'm1' },
      { id: '2', name: 'NileSat-301', status: 'NOMINAL', missionId: 'm2' }
    ]);
  }),
  http.get('/api/spacecrafts/:id', ({ params }) => {
    return HttpResponse.json({ 
      id: params.id, 
      name: `Spacecraft ${params.id}`, 
      status: 'NOMINAL', 
      missionId: 'm1',
      tle: [
        "1 25544U 98067A   23285.84589120  .00015525  00000+0  28114-3 0  9997",
        "2 25544  51.6416 123.6338 0001431 169.5786 169.5303 15.49856111420138"
      ]
    });
  }),

  http.get('/api/missions', () => {
    return HttpResponse.json([
      { id: 'm1', name: 'Earth Observation Main', objective: 'Hi-res imaging', startDate: new Date().toISOString(), status: 'ACTIVE' }
    ]);
  }),
  http.get('/api/alerts', () => {
    return HttpResponse.json([
      { id: 'a1', severity: 'INFO', message: 'AOS Acquired', timestamp: Date.now(), spacecraftId: '1' }
    ]);
  })
];
