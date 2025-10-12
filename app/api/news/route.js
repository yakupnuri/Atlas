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

// Get all news
export async function GET(request) {
  try {
    const db = await getDb();
    
    // Get all news sorted by publish date (newest first)
    const news = await db.collection('news')
      .find({})
      .sort({ publishDate: -1 })
      .toArray();
    
    return NextResponse.json(
      { news },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Server error', news: [] },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create new news
export async function POST(request) {
  try {
    const data = await request.json();
    const db = await getDb();
    
    const newNews = {
      id: require('crypto').randomUUID(),
      ...data,
      createdAt: new Date(),
      commentsEnabled: false
    };
    
    await db.collection('news').insertOne(newNews);
    
    return NextResponse.json(
      { message: 'News created successfully', news: newNews },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update news
export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await getDb();
    
    const { id, _id, ...updateData } = data;
    
    await db.collection('news').updateOne(
      { id },
      { $set: updateData }
    );
    
    return NextResponse.json(
      { message: 'News updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete news
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'News ID required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    await db.collection('news').deleteOne({ id });
    
    return NextResponse.json(
      { message: 'News deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
