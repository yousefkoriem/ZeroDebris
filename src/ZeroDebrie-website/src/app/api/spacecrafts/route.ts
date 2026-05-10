import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'eo-1', name: 'Egypt Observer-1', status: 'NOMINAL', missionId: 'm1' },
    { id: '2', name: 'NileSat-301', status: 'NOMINAL', missionId: 'm2' }
  ]);
}
