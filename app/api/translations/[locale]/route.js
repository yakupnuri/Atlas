import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    const { locale } = params;
    const db = await getDb();
    
    // Try to get from database first
    const language = await db.collection('languages').findOne({ 
      code: locale, 
      active: true 
    });
    
    if (language && language.translations) {
      return NextResponse.json(
        { translations: language.translations },
        { headers: corsHeaders }
      );
    }
    
    // Fallback to JSON files
    try {
      const translations = await import(`@/messages/${locale}.json`);
      return NextResponse.json(
        { translations: translations.default },
        { headers: corsHeaders }
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Translations not found' },
        { status: 404, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
