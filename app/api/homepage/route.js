import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch homepage content
export async function GET(request) {
  try {
    const db = await getDb();
    const collection = db.collection('homepage_content');
    
    // Get homepage content (should be single document)
    let content = await collection.findOne({ type: 'homepage' });
    
    // If no content exists, create default
    if (!content) {
      content = {
        id: uuidv4(),
        type: 'homepage',
        hero: {
          badge: 'Welkom bij Stichting Atlas',
          title: 'Samen Bouwen Aan Een',
          titleHighlight: 'Inclusieve Toekomst',
          description: 'Een gemeenschap waar culturen samenkomen, kennis wordt gedeeld en iedereen de kans krijgt om te groeien.',
          image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1920',
          primaryButton: {
            text: 'Ontdek Atlas Academie',
            link: '/academie'
          },
          secondaryButton: {
            text: 'Neem Contact Op',
            link: '/contact'
          },
          trustBadges: [
            { text: 'ANBI Erkend', icon: 'CheckCircle' },
            { text: '500+ Deelnemers', icon: 'CheckCircle' },
            { text: '10+ Jaar Ervaring', icon: 'CheckCircle' }
          ]
        },
        featuredSections: {
          showNews: true,
          showEvents: true,
          showProjects: true,
          newsCount: 4,
          eventsCount: 3,
          projectsCount: 6
        },
        quickLinks: [
          { title: 'Evenementen', icon: 'Calendar', href: '/evenementen', color: 'from-orange-500 to-red-500' },
          { title: 'Nieuws', icon: 'Newspaper', href: '/nieuws', color: 'from-blue-500 to-indigo-500' },
          { title: 'ANBI Status', icon: 'FileText', href: '/anbi', color: 'from-green-500 to-teal-500' },
          { title: 'Contact', icon: 'MessageSquare', href: '/contact', color: 'from-purple-500 to-pink-500' }
        ],
        seo: {
          title: 'Stichting Atlas - Samen Bouwen Aan Een Inclusieve Toekomst',
          description: 'Een gemeenschap waar culturen samenkomen, kennis wordt gedeeld en iedereen de kans krijgt om te groeien.',
          keywords: 'stichting atlas, community, educatie, cultuur, inclusief'
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
    console.error('Error fetching homepage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage content', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update homepage content
export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await getDb();
    const collection = db.collection('homepage_content');
    
    // Remove _id if present
    const { _id, ...updateData } = data;
    
    // Update homepage content
    const result = await collection.updateOne(
      { type: 'homepage' },
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
      message: 'Homepage updated successfully',
      data: updateData
    });
  } catch (error) {
    console.error('Error updating homepage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage content', details: error.message },
      { status: 500 }
    );
  }
}
