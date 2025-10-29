import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// Get maintenance status
export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ type: 'maintenance' });
    
    return NextResponse.json({
      success: true,
      enabled: settings?.enabled || false,
      message: settings?.message || 'Deze website is momenteel in onderhoud. We zijn zo terug!',
      estimatedTime: settings?.estimatedTime || ''
    });
  } catch (error) {
    console.error('Error fetching maintenance status:', error);
    return NextResponse.json({
      success: true,
      enabled: false,
      message: 'Deze website is momenteel in onderhoud. We zijn zo terug!'
    });
  }
}

// Update maintenance status
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await getDb();
    
    await db.collection('settings').updateOne(
      { type: 'maintenance' },
      { 
        $set: { 
          type: 'maintenance',
          enabled: data.enabled,
          message: data.message || 'Deze website is momenteel in onderhoud. We zijn zo terug!',
          estimatedTime: data.estimatedTime || '',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    return NextResponse.json({
      success: true,
      message: 'Onderhoudsinstelling bijgewerkt'
    });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    return NextResponse.json(
      { success: false, error: 'Fout bij bijwerken' },
      { status: 500 }
    );
  }
}
