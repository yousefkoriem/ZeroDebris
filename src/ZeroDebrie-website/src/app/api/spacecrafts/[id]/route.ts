import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ 
    id: params.id, 
    name: `Spacecraft ${params.id}`, 
    status: 'NOMINAL', 
    missionId: 'm1',
    tle: [
      "1 25544U 98067A   23285.84589120  .00015525  00000+0  28114-3 0  9997",
      "2 25544  51.6416 123.6338 0001431 169.5786 169.5303 15.49856111420138"
    ]
  });
}
