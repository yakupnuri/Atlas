import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch Atlas Academie content
export async function GET(request) {
  try {
    const db = await getDb();
    const collection = db.collection('academie_content');
    
    // Get academie content (should be single document)
    let content = await collection.findOne({ type: 'academie' });
    
    // If no content exists, create default
    if (!content) {
      content = {
        id: uuidv4(),
        type: 'academie',
        hero: {
          title: 'Atlas Academie',
          subtitle: 'Ontdek, Leer en Groei',
          description: 'Welkom bij Atlas Academie - jouw platform voor educatie, carrièreontwikkeling en projecten die impact maken.',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920'
        },
        introduction: {
          title: 'Wat is Atlas Academie?',
          content: 'Atlas Academie is het educatieve hart van Stichting Atlas. Hier brengen we mensen samen voor leren, groeien en samenwerken. Of je nu je kennis wilt uitbreiden, je carrière wilt ontwikkelen of wilt bijdragen aan betekenisvolle projecten - wij bieden de middelen en het platform.',
          features: [
            {
              id: uuidv4(),
              title: 'Cultuur & Educatie',
              description: 'Cursussen, workshops en educatieve programmas',
              icon: 'GraduationCap',
              link: '/academie/cultuur-educatie'
            },
            {
              id: uuidv4(),
              title: 'Carrièrecentrum',
              description: 'Vacatures, seminars en career development',
              icon: 'Briefcase',
              link: '/academie/carriere'
            },
            {
              id: uuidv4(),
              title: 'Projectgroep',
              description: 'Community projects en volunteer opportunities',
              icon: 'FolderKanban',
              link: '/academie/projectgroep'
            }
          ]
        },
        stats: [
          { id: uuidv4(), label: 'Cursussen', value: '50+' },
          { id: uuidv4(), label: 'Deelnemers', value: '500+' },
          { id: uuidv4(), label: 'Projecten', value: '20+' },
          { id: uuidv4(), label: 'Partners', value: '15+' }
        ],
        cta: {
          title: 'Klaar om te Beginnen?',
          description: 'Word onderdeel van onze gemeenschap en ontdek alle mogelijkheden',
          primaryButton: {
            text: 'Bekijk Cursussen',
            link: '/academie/cultuur-educatie'
          },
          secondaryButton: {
            text: 'Neem Contact Op',
            link: '/contact'
          }
        },
        seo: {
          title: 'Atlas Academie - Educatie, Carrière & Projecten',
          description: 'Ontdek Atlas Academie: cursussen, carrièremogelijkheden en community projecten',
          keywords: 'atlas academie, educatie, carrière, projecten, cursussen'
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await collection.insertOne(content);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: content 
    });
  } catch (error) {
    console.error('Error fetching academie:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch academie content', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update academie content
export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await getDb();
    const collection = db.collection('academie_content');
    
    // Remove _id if present
    const { _id, ...updateData } = data;
    
    // Update academie content
    const result = await collection.updateOne(
      { type: 'academie' },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: 'Academie updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Error updating academie:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update academie content', details: error.message },
      { status: 500 }
    );
  }
}
