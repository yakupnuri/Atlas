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
          content: 'Stichting Atlas is een jonge, dynamische organisatie die in 2024 is opgericht door een groep maatschappelijk betrokken nieuwkomers uit Turkije, woonachtig in Leiden en omliggende gemeenten. De stichting is geworteld in het streven naar een inclusieve, verbonden en vreedzame samenleving waarin culturele diversiteit wordt gewaardeerd en waarin iedereen actief kan deelnemen aan het maatschappelijk leven. Met een team van toegewijde vrijwilligers, ervaren projectleiders en betrokken bestuursleden realiseert Atlas sociale, culturele en educatieve projecten die bijdragen aan wederzijds begrip, acceptatie en participatie.'
        },
        mission: {
          title: 'Onze Missie',
          content: 'We bouwen bruggen tussen culturen en generaties door toegankelijke programma\'s en ontmoetingen.',
          items: [
            'Toegankelijke en impactvolle educatieve programma\'s en informatieve bijeenkomsten organiseren',
            'Projecten ontwikkelen die interculturele dialoog en ontmoeting bevorderen',
            'Participatie en integratie van nieuwkomers en andere kwetsbare groepen ondersteunen',
            'Activiteiten opzetten voor jongeren, volwassenen en ouderen, afgestemd op hun behoeften',
            'Lokale betrokkenheid en gemeenschapszin versterken via laagdrempelige initiatieven'
          ]
        },
        vision: {
          title: 'Onze Visie',
          content: 'Wij geloven in een samenleving waarin respect, tolerantie en culturele diversiteit als fundamentele waarden gelden. Stichting Atlas wil bijdragen aan sociale cohesie, actief burgerschap en gedeelde toekomstperspectieven. Door middel van educatie, ontmoeting en samenwerking creëren wij ruimte voor dialoog en persoonlijke ontwikkeling. Onze projecten zijn gericht op het zichtbaar maken en verbinden van mensen en gemeenschappen.'
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
    
    // Remove _id and type from update data to avoid immutable field error
    const { _id, type, ...updateData } = data;
    
    await db.collection('about').updateOne(
      { type: 'content' },
      { 
        $set: {
          type: 'content',
          ...updateData
        }
      },
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
