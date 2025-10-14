import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// POST /api/crm/volunteers - Submit volunteer application
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { error: 'Alle verplichte velden moeten worden ingevuld' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const newApplication = {
      id: uuidv4(),
      type: 'volunteer',
      projectId: data.projectId,
      projectTitle: data.projectTitle,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      availability: data.availability,
      experience: data.experience || '',
      message: data.message,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('crm_applications').insertOne(newApplication);

    return NextResponse.json({ 
      message: 'Aanmelding succesvol ontvangen',
      application: newApplication 
    });
  } catch (error) {
    console.error('Error creating volunteer application:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}

// GET /api/crm/volunteers - Get all volunteer applications (CRM only)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const applications = await db
      .collection('crm_applications')
      .find({ type: 'volunteer' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}