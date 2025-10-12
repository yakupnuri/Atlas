import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get all news
export async function GET(request) {
  try {
    const db = await getDb();
    
    // Get all news sorted by publish date (newest first)
    const news = await db.collection('news')
      .find({})
      .sort({ publishDate: -1 })
      .toArray();
    
    return NextResponse.json(
      { news },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Server error', news: [] },
      { status: 500, headers: corsHeaders }
    );
  }
}
