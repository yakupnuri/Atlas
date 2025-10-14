import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST - Create new comment (from public)
export async function POST(request) {
  try {
    const db = await getDb();
    const { articleId, name, email, comment } = await request.json();
    
    if (!articleId || !name || !email || !comment) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const newComment = {
      id: uuidv4(),
      articleId,
      name,
      email,
      comment,
      status: 'pending', // pending, approved, spam, rejected
      createdAt: new Date().toISOString(),
    };
    
    await db.collection('comments').insertOne(newComment);
    
    return NextResponse.json(
      { message: 'Reactie succesvol verzonden en wacht op goedkeuring', comment: newComment },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Server fout' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET - Fetch comments
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const status = searchParams.get('status'); // For admin panel
    const all = searchParams.get('all'); // For admin - get all comments
    
    const db = await getDb();
    
    let query = {};
    
    // Admin request - get all or by status
    if (all === 'true') {
      if (status) {
        query.status = status;
      }
    } else {
      // Public request - only approved
      query.status = 'approved';
    }
    
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
      { error: 'Server fout' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - Update comment status (Admin only)
export async function PUT(request) {
  try {
    const { id, status, action } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID vereist' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    let updateData = {};
    
    if (action === 'approve') {
      updateData.status = 'approved';
    } else if (action === 'reject') {
      updateData.status = 'rejected';
    } else if (action === 'spam') {
      updateData.status = 'spam';
    } else if (status) {
      updateData.status = status;
    }
    
    const result = await db.collection('comments').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Reactie niet gevonden' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Status bijgewerkt' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      { error: 'Server fout' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - Delete comment (Admin only)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Comment ID vereist' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    const result = await db.collection('comments').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Reactie niet gevonden' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Reactie verwijderd' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Server fout' },
      { status: 500, headers: corsHeaders }
    );
  }
}
