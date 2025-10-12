import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const db = await getDb();
    const { articleId, name, email, comment } = await request.json();
    
    if (!articleId || !name || !email || !comment) {
      return NextResponse.json(
        { error: 'Tüm alanlar gerekli' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const newComment = {
      id: uuidv4(),
      articleId,
      name,
      email,
      comment,
      approved: true, // Auto-approve for demo
      createdAt: new Date().toISOString(),
    };
    
    await db.collection('comments').insertOne(newComment);
    
    return NextResponse.json(
      { message: 'Yorum başarıyla gönderildi', comment: newComment },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    
    const db = await getDb();
    
    let query = { approved: true };
    if (articleId) {
      query.articleId = articleId;
    }
    
    const comments = await db.collection('comments')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(
      { comments },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
