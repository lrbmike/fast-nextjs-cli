import { NextResponse } from 'next/server';
import type { DashboardData } from '@/lib/types/dashboard';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data: DashboardData = {
    user: {
      name: 'Admin',
      role: 'Owner'
    },
    stats: [
      { label: 'Active sessions', value: '12', detail: '+2 today' },
      { label: 'Projects', value: '8', detail: '+1 this week' },
      { label: 'API calls', value: '1,240', detail: 'Last 24h' }
    ],
    activity: [
      'Signed in from a new device',
      'Created a new project',
      'Updated billing settings'
    ],
    updatedAt: new Date().toISOString()
  };

  return NextResponse.json({ data });
}
