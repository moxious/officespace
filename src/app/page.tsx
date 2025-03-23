'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import Image from 'next/image';

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

export default function Home() {
  const [numPeople, setNumPeople] = useState('');
  const [costPerHour, setCostPerHour] = useState('');
  const [meetingCosts, setMeetingCosts] = useState<MeetingCostResponse | null>(null);
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [meetingStartTime, setMeetingStartTime] = useState<string | null>(null);

  const fetchMeetingCost = useCallback(async () => {
    if (!meetingStartTime) return;

    try {
      const response = await fetch('/api/meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: meetingStartTime,
          numberOfPeople: parseInt(numPeople),
          costPerPersonPerHour: parseFloat(costPerHour),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to calculate meeting cost');
        setIsRunning(false);
        return;
      }

      const data = await response.json();
      setMeetingCosts(data);
    } catch {
      setError('Failed to calculate meeting cost');
      setIsRunning(false);
    }
  }, [meetingStartTime, numPeople, costPerHour]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && meetingStartTime) {
      // Initial fetch
      fetchMeetingCost();
      
      // Set up interval for subsequent fetches
      intervalId = setInterval(fetchMeetingCost, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, meetingStartTime, fetchMeetingCost]);

  const formatUTCTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const startMeeting = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMeetingCosts(null);

    const people = parseInt(numPeople);
    const cost = parseFloat(costPerHour);

    if (isNaN(people) || people <= 0 || !Number.isInteger(people)) {
      setError('Number of people must be a positive integer');
      return;
    }

    if (isNaN(cost) || cost <= 0) {
      setError('Cost per hour must be a positive number');
      return;
    }

    // Ensure UTC timestamp
    const startTime = new Date().toISOString();
    setMeetingStartTime(startTime);
    setIsRunning(true);
  };

  const stopMeeting = () => {
    setIsRunning(false);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="mb-8 relative w-32 h-32">
        <Image
          src="/petergibbons.png"
          alt="Peter Gibbons from Office Space"
          fill
          className="object-cover rounded-full"
          priority
        />
      </div>
      <h1 className="text-4xl font-bold mb-8">Meeting Cost Calculator</h1>
      <div className="w-full max-w-md">
        <form onSubmit={startMeeting} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="numPeople">
              Number of People
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="numPeople"
              type="number"
              min="1"
              step="1"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              placeholder="Enter number of people"
              disabled={isRunning}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="costPerHour">
              Cost per Person per Hour ($)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="costPerHour"
              type="number"
              min="0.01"
              step="0.01"
              value={costPerHour}
              onChange={(e) => setCostPerHour(e.target.value)}
              placeholder="Enter cost per hour"
              disabled={isRunning}
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}
          {!isRunning ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Start Meeting
            </button>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="button"
              onClick={stopMeeting}
            >
              End Meeting
            </button>
          )}
        </form>
        
        {meetingCosts && (
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <h2 className="text-lg font-semibold text-center mb-4 text-black">Meeting Cost Breakdown</h2>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Total Cost So Far:</span>
                <span className="text-green-700 font-bold text-xl">${meetingCosts.totalCostSoFar.toFixed(2)}</span>
              </p>
              <div className="border-t border-gray-200 my-4"></div>
              <p className="flex justify-between">
                <span className="text-gray-600">Per Hour:</span>
                <span className="text-green-700 font-semibold">${meetingCosts.costPerHour.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Per Minute:</span>
                <span className="text-green-700 font-semibold">${meetingCosts.costPerMinute.toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Per Second:</span>
                <span className="text-green-700 font-semibold">${meetingCosts.costPerSecond.toFixed(2)}</span>
              </p>
              <div className="border-t border-gray-200 my-4"></div>
              <p className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="text-gray-700 font-semibold">{formatDuration(meetingCosts.elapsedSeconds)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Started at: {formatUTCTimestamp(meetingCosts.startTime)} 
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
