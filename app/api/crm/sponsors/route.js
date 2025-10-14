import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// POST /api/crm/sponsors - Submit sponsorship request
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.companyName || !data.contactPerson || !data.email || !data.phone || !data.message) {
      return NextResponse.json(
        { error: 'Alle verplichte velden moeten worden ingevuld' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const newSponsorship = {
      id: uuidv4(),
      type: 'sponsor',
      projectId: data.projectId,
      projectTitle: data.projectTitle,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      sponsorshipType: data.sponsorshipType,
      amount: data.amount ? parseFloat(data.amount) : null,
      message: data.message,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('crm_applications').insertOne(newSponsorship);

    return NextResponse.json({ 
      message: 'Sponsoraanvraag succesvol ontvangen',
      sponsorship: newSponsorship 
    });
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}

// GET /api/crm/sponsors - Get all sponsorship requests (CRM only)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const sponsorships = await db
      .collection('crm_applications')
      .find({ type: 'sponsor' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ sponsorships });
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}