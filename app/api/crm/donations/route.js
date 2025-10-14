import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// POST /api/crm/donations - Submit donation
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.amount) {
      return NextResponse.json(
        { error: 'Alle verplichte velden moeten worden ingevuld' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const newDonation = {
      id: uuidv4(),
      type: 'donation',
      projectId: data.projectId,
      projectTitle: data.projectTitle,
      fullName: data.fullName,
      email: data.email,
      amount: parseFloat(data.amount),
      message: data.message || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.collection('crm_applications').insertOne(newDonation);

    return NextResponse.json({ 
      message: 'Donatie succesvol geregistreerd',
      donation: newDonation 
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}

// GET /api/crm/donations - Get all donations (CRM only)
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const donations = await db
      .collection('crm_applications')
      .find({ type: 'donation' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden' },
      { status: 500 }
    );
  }
}