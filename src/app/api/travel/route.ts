
import { NextResponse } from 'next/server';

let travelData: Array<{ location: string; startDate: string; endDate: string; distance: number; modality: string }> = [];

export async function POST(req: Request) {
  const { location, startDate, endDate, distance, modality } = await req.json();

  if (
    typeof location === 'string' &&
    typeof startDate === 'string' &&
    typeof endDate === 'string' &&
    typeof distance === 'number' &&
    typeof modality === 'string'
  ) {
    travelData.push({ location, startDate, endDate, distance, modality });
    return NextResponse.json({ message: 'Data saved successfully' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(travelData, { status: 200 });
}