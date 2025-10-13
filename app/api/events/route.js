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

// Get all events (public)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming');
    const category = searchParams.get('category');
    
    const db = await getDb();
    
    let query = {};
    
    // If upcoming=true, only show future events
    if (upcoming === 'true') {
      query.startAt = { $gte: new Date().toISOString() };
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const events = await db.collection('events')
      .find(query)
      .sort({ startAt: 1 })
      .toArray();
    
    // Calculate capacity info for each event
    const eventsWithCapacity = await Promise.all(
      events.map(async (event) => {
        const reservations = await db.collection('reservations')
          .find({ eventId: event.id, status: 'confirmed' })
          .toArray();
        
        const reservedCount = reservations.reduce((sum, r) => sum + (r.count || 0), 0);
        const available = (event.capacity || 0) - reservedCount;
        
        return {
          ...event,
          reservedCount,
          available
        };
      })
    );
    
    return NextResponse.json({ events: eventsWithCapacity }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create new event (admin only)
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const eventData = await request.json();
    
    const db = await getDb();
    
    // Convert admin form data to standardized format
    const { date, startTime, endTime, allDay, maxParticipants, location, ...rest } = eventData;
    
    // Create startAt and endAt ISO strings
    let startAt, endAt;
    if (date) {
      if (allDay) {
        startAt = new Date(date + 'T00:00:00').toISOString();
        endAt = new Date(date + 'T23:59:59').toISOString();
      } else {
        startAt = new Date(date + 'T' + (startTime || '00:00:00')).toISOString();
        endAt = new Date(date + 'T' + (endTime || '23:59:59')).toISOString();
      }
    }
    
    const newEvent = {
      id: require('crypto').randomUUID(),
      ...rest,
      startAt,
      endAt,
      capacity: parseInt(maxParticipants) || 0,
      locationName: location || rest.locationName || '',
      isPaid: rest.price && parseFloat(rest.price) > 0,
      price: parseFloat(rest.price) || 0,
      bannerImage: rest.image || rest.bannerImage || '',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await db.collection('events').insertOne(newEvent);
    
    return NextResponse.json(
      { message: 'Event created successfully', event: newEvent },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update event (admin only)
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { id, ...eventData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    // Convert admin form data to standardized format
    const { date, startTime, endTime, allDay, maxParticipants, location, ...rest } = eventData;
    
    // Create startAt and endAt ISO strings
    let startAt, endAt;
    if (date) {
      if (allDay) {
        startAt = new Date(date + 'T00:00:00').toISOString();
        endAt = new Date(date + 'T23:59:59').toISOString();
      } else {
        startAt = new Date(date + 'T' + (startTime || '00:00:00')).toISOString();
        endAt = new Date(date + 'T' + (endTime || '23:59:59')).toISOString();
      }
    }
    
    const updateData = {
      ...rest,
      ...(startAt && { startAt }),
      ...(endAt && { endAt }),
      ...(maxParticipants && { capacity: parseInt(maxParticipants) }),
      ...(location && { locationName: location }),
      ...(rest.image && { bannerImage: rest.image }),
      ...(rest.price !== undefined && { 
        isPaid: parseFloat(rest.price) > 0,
        price: parseFloat(rest.price) || 0
      }),
      updatedAt: new Date().toISOString()
    };
    
    await db.collection('events').updateOne(
      { id },
      { $set: updateData }
    );
    
    return NextResponse.json(
      { message: 'Event updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete event (admin only)
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Event ID required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    await db.collection('events').deleteOne({ id });
    
    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
