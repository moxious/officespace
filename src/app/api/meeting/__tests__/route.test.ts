/**
 * @jest-environment node
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock the Request object
global.Request = class extends Request {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
  }
} as typeof Request;

describe('Meeting Cost API', () => {
  const mockDate = new Date('2024-03-22T10:00:00Z');

  beforeEach(() => {
    // Reset mock date before each test
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    // Restore Date.now() after each test
    jest.useRealTimers();
  });

  it('should calculate $0 total cost when no time has elapsed', async () => {
    // Use our mocked timestamp
    const startTime = mockDate.toISOString();
    
    // Create the request object
    const request = new NextRequest('http://localhost:3000/api/meeting', {
      method: 'POST',
      body: JSON.stringify({
        startTime: startTime,
        numberOfPeople: 1,
        costPerPersonPerHour: 1
      })
    });

    // Call the API route
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      costPerHour: 1,
      costPerMinute: 1/60,
      costPerSecond: 1/3600,
      totalCostSoFar: 0,
      numberOfPeople: 1,
      costPerPersonPerHour: 1,
      elapsedSeconds: 0
    });
  });

  it('should calculate $2 total cost for 2 people after exactly 1 hour', async () => {
    const startTime = mockDate.toISOString();
    
    // Advance time by exactly 1 hour (3600000 milliseconds)
    jest.advanceTimersByTime(3600000);
    
    const request = new NextRequest('http://localhost:3000/api/meeting', {
      method: 'POST',
      body: JSON.stringify({
        startTime: startTime,
        numberOfPeople: 2,
        costPerPersonPerHour: 1
      })
    });

    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      costPerHour: 2, // 2 people × $1/hour
      costPerMinute: 2/60,
      costPerSecond: 2/3600,
      totalCostSoFar: 2, // After 1 hour, total cost should be $2
      numberOfPeople: 2,
      costPerPersonPerHour: 1,
      elapsedSeconds: 3600 // 1 hour = 3600 seconds
    });
  });
}); 