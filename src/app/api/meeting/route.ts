import { NextRequest, NextResponse } from 'next/server';

interface MeetingCostResponse {
  costPerHour: number;
  costPerMinute: number;
  costPerSecond: number;
  totalCostSoFar: number;
  startTime: string;
  numberOfPeople: number;
  costPerPersonPerHour: number;
  elapsedSeconds: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { startTime, numberOfPeople, costPerPersonPerHour } = body;

    // Validate input parameters
    if (!startTime || !numberOfPeople || !costPerPersonPerHour) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Convert any timezone to UTC and validate timestamp
    let startTimeUTC: Date;
    try {
      // Parse the input time (handles any timezone)
      const inputDate = new Date(startTime);
      if (isNaN(inputDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      // Convert to UTC ISO string
      startTimeUTC = new Date(inputDate.getTime());
      
      // If the input wasn't already UTC, log a warning (helpful for debugging)
      if (!startTime.endsWith('Z')) {
        console.warn(`Input timestamp was converted from local/other timezone to UTC: ${startTime} -> ${startTimeUTC.toISOString()}`);
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid startTime format. Please provide a valid timestamp.' },
        { status: 400 }
      );
    }

    // Validate numberOfPeople is a positive integer
    if (!Number.isInteger(numberOfPeople) || numberOfPeople <= 0) {
      return NextResponse.json(
        { error: 'numberOfPeople must be a positive integer' },
        { status: 400 }
      );
    }

    // Validate costPerPersonPerHour is a positive number
    if (typeof costPerPersonPerHour !== 'number' || costPerPersonPerHour <= 0) {
      return NextResponse.json(
        { error: 'costPerPersonPerHour must be a positive number' },
        { status: 400 }
      );
    }

    const costPerHour = numberOfPeople * costPerPersonPerHour;
    const costPerMinute = costPerHour / 60;
    const costPerSecond = costPerMinute / 60;

    // Calculate elapsed time and total cost using UTC timestamps
    const nowUTC = new Date();
    const elapsedSeconds = Math.floor((nowUTC.getTime() - startTimeUTC.getTime()) / 1000);
    const totalCostSoFar = costPerSecond * elapsedSeconds;

    const response: MeetingCostResponse = {
      costPerHour,
      costPerMinute,
      costPerSecond,
      totalCostSoFar,
      startTime: startTimeUTC.toISOString(), // Always return UTC ISO string
      numberOfPeople,
      costPerPersonPerHour,
      elapsedSeconds
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
} 