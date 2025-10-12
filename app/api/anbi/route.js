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

export async function GET(request) {
  try {
    const db = await getDb();
    
    // Get ANBI data
    let anbiData = await db.collection('anbi').findOne({ type: 'settings' });
    
    if (!anbiData) {
      // Create default ANBI data
      anbiData = {
        type: 'settings',
        organizationName: 'Stichting Atlas',
        rsin: 'XXXXXXXXX',
        address: 'Amsterdam, Nederland',
        email: 'info@stichtingatlas.nl',
        description: 'Een ANBI (Algemeen Nut Beogende Instelling) is een organisatie die zich inzet voor het algemeen nut. Door onze ANBI-status kunnen donateurs hun giften aan Stichting Atlas onder voorwaarden aftrekken van de belasting.',
        beleidsplan: {
          description: 'Ons beleidsplan beschrijft onze doelstellingen en strategieën voor de komende jaren.',
          pdfUrl: null
        },
        huisstijl: {
          description: 'Onze huisstijlgids met logo\'s, kleuren en richtlijnen voor communicatie.',
          pdfUrl: null
        },
        jaarrekening: {
          description: 'Financiële rapportage en transparantie over onze inkomsten en uitgaven.',
          pdfUrl: null
        },
        createdAt: new Date().toISOString()
      };
      
      await db.collection('anbi').insertOne(anbiData);
    }
    
    return NextResponse.json(
      { anbi: anbiData },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching ANBI data:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
