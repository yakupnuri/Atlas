import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { checkAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get about page content
export async function GET(request) {
  try {
    const db = await getDb();
    
    // Get or create default about content
    let aboutContent = await db.collection('about').findOne({ type: 'content' });
    
    if (!aboutContent) {
      // Create default content in Dutch
      aboutContent = {
        type: 'content',
        whoWeAre: {
          title: 'Wie zijn wij',
          content: 'Wij zijn mensen die onlangs uit Turkije naar Nederland zijn gekomen. We willen ons aanpassen aan Nederland, integreren in de Nederlandse samenleving en ons leven hier voortzetten. Als initiatief willen we een cultuur van samenleven creëren.'
        },
        mission: {
          title: 'Onze Missie',
          content: 'We bouwen bruggen tussen culturen en generaties door toegankelijke programma\'s en ontmoetingen.'
        },
        vision: {
          title: 'Onze Visie',
          content: 'Een samenleving waarin iedereen zich welkom voelt en de kans krijgt om te groeien en te ontwikkelen.'
        },
        values: [
          { id: uuidv4(), title: 'Inclusiviteit', description: 'Iedereen is welkom bij ons' },
          { id: uuidv4(), title: 'Respect', description: 'Gelijke waardering voor alle culturen' },
          { id: uuidv4(), title: 'Samenwerking', description: 'Samen zijn we sterker' }
        ]
      };
      
      await db.collection('about').insertOne(aboutContent);
    }
    
    // Get team members
    const teamMembers = await db.collection('team').find({}).sort({ order: 1 }).toArray();
    
    return NextResponse.json(
      { content: aboutContent, team: teamMembers },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update about content
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
    
    await db.collection('about').updateOne(
      { type: 'content' },
      { $set: data },
      { upsert: true }
    );
    
    return NextResponse.json(
      { message: 'Succesvol bijgewerkt' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
