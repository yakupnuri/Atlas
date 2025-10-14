import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { checkAuth } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request) {
  try {
    const db = await getDb();
    const anbiData = await db.collection('anbi').findOne({ type: 'settings' });
    
    return NextResponse.json(
      { anbi: anbiData },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Niet geautoriseerd' },
      { status: 401, headers: corsHeaders }
    );
  }
  
  try {
    const db = await getDb();
    const data = await request.json();
    
    await db.collection('anbi').updateOne(
      { type: 'settings' },
      { $set: data },
      { upsert: true }
    );
    
    return NextResponse.json(
      { message: 'ANBI gegevens bijgewerkt' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
