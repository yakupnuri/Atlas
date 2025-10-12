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

// Get team members
export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const teamMembers = await db.collection('team')
      .find(query)
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json(
      { team: teamMembers },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Add team member
export async function POST(request) {
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
    
    const teamMember = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString()
    };
    
    await db.collection('team').insertOne(teamMember);
    
    return NextResponse.json(
      { message: 'Teamlid toegevoegd', member: teamMember },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update team member
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
    const { id, ...updateData } = data;
    
    await db.collection('team').updateOne(
      { id },
      { $set: updateData }
    );
    
    return NextResponse.json(
      { message: 'Teamlid bijgewerkt' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete team member
export async function DELETE(request) {
  const auth = checkAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Niet geautoriseerd' },
      { status: 401, headers: corsHeaders }
    );
  }
  
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await db.collection('team').deleteOne({ id });
    
    return NextResponse.json(
      { message: 'Teamlid verwijderd' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
