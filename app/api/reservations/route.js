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

// Get reservations for an event
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    const db = await getDb();
    
    if (eventId) {
      const reservations = await db.collection('reservations')
        .find({ eventId })
        .sort({ createdAt: 1 })
        .toArray();
      
      return NextResponse.json({ reservations }, { headers: corsHeaders });
    }
    
    const allReservations = await db.collection('reservations')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ reservations: allReservations }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create new reservation
export async function POST(request) {
  try {
    const { eventId, email, phone, participants } = await request.json();
    
    if (!eventId || !email || !participants || participants.length === 0) {
      return NextResponse.json(
        { error: 'Event ID, email, and at least one participant required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    // Get last badge number for this event
    const lastReservation = await db.collection('reservations')
      .find({ eventId })
      .sort({ 'participants.badgeNumber': -1 })
      .limit(1)
      .toArray();
    
    let startBadgeNumber = 1;
    if (lastReservation.length > 0 && lastReservation[0].participants.length > 0) {
      const maxBadge = Math.max(...lastReservation[0].participants.map(p => p.badgeNumber || 0));
      startBadgeNumber = maxBadge + 1;
    }
    
    // Assign badge numbers to each participant
    const participantsWithBadges = participants.map((participant, index) => ({
      name: participant.name,
      badgeNumber: startBadgeNumber + index,
      attended: false,
    }));
    
    const reservation = {
      id: require('crypto').randomUUID(),
      eventId,
      email,
      phone: phone || '',
      participants: participantsWithBadges,
      totalParticipants: participantsWithBadges.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.collection('reservations').insertOne(reservation);
    
    // Update event statistics
    await db.collection('events').updateOne(
      { id: eventId },
      { 
        $inc: { 
          'statistics.totalReservations': participantsWithBadges.length 
        }
      }
    );
    
    return NextResponse.json(
      { 
        message: 'Reservation created successfully', 
        reservation,
        badgeNumbers: participantsWithBadges.map(p => p.badgeNumber)
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
