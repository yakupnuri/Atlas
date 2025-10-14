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

// Get page by slug
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    
    const db = await getDb();
    
    if (slug) {
      const page = await db.collection('pages').findOne({ slug });
      return NextResponse.json({ page }, { headers: corsHeaders });
    }
    
    const pages = await db.collection('pages').find({}).toArray();
    return NextResponse.json({ pages }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create/Update page
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const pageData = await request.json();
    const db = await getDb();
    
    const existingPage = await db.collection('pages').findOne({ slug: pageData.slug });
    
    if (existingPage) {
      await db.collection('pages').updateOne(
        { slug: pageData.slug },
        { 
          $set: {
            ...pageData,
            updatedAt: new Date()
          }
        }
      );
      
      return NextResponse.json(
        { message: 'Page updated successfully' },
        { headers: corsHeaders }
      );
    } else {
      await db.collection('pages').insertOne({
        id: require('crypto').randomUUID(),
        ...pageData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      return NextResponse.json(
        { message: 'Page created successfully' },
        { headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
