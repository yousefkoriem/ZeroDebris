import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    { id: 'a1', severity: 'INFO', message: 'AOS Acquired', timestamp: Date.now(), spacecraftId: '1' }
  ]);
}
