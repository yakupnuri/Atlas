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

// Get all languages
export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'site'; // 'site' or 'admin'
    
    const collection = type === 'admin' ? 'admin_languages' : 'languages';
    const languages = await db.collection(collection)
      .find({})
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json(
      { languages },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Add new language
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
    const { type = 'site', ...languageData } = data;
    
    const collection = type === 'admin' ? 'admin_languages' : 'languages';
    
    const language = {
      id: uuidv4(),
      ...languageData,
      active: languageData.active !== undefined ? languageData.active : true,
      createdAt: new Date().toISOString(),
    };
    
    await db.collection(collection).insertOne(language);
    
    return NextResponse.json(
      { message: 'Taal toegevoegd', language },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error adding language:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update language
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
    const { id, type = 'site', ...updateData } = data;
    
    const collection = type === 'admin' ? 'admin_languages' : 'languages';
    
    await db.collection(collection).updateOne(
      { id },
      { $set: updateData }
    );
    
    return NextResponse.json(
      { message: 'Taal bijgewerkt' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating language:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete language
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
    const type = searchParams.get('type') || 'site';
    
    const collection = type === 'admin' ? 'admin_languages' : 'languages';
    
    await db.collection(collection).deleteOne({ id });
    
    return NextResponse.json(
      { message: 'Taal verwijderd' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting language:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
