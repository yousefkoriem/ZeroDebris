import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'm1', name: 'Earth Observation Main', objective: 'Hi-res imaging', startDate: new Date().toISOString(), status: 'ACTIVE' }
  ]);
}
