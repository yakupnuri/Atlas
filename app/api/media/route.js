import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getDb } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get all media
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const db = await getDb();
    
    let query = {}
    if (category && category !== 'all') {
      query.category = category
    }
    
    const media = await db.collection('media')
      .find(query)
      .sort({ uploadDate: -1 })
      .toArray();
    
    return NextResponse.json({ 
      success: true,
      media,
      data: media // Both for compatibility
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Server error', media: [], data: [] },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Upload media
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${originalName}`;
    const filepath = join(process.cwd(), 'public', 'uploads', filename);

    // Save file
    await writeFile(filepath, buffer);
    
    // Save to database
    const db = await getDb();
    const mediaDoc = {
      id: require('crypto').randomUUID(),
      filename,
      originalName: file.name,
      path: `/uploads/${filename}`,
      url: `/uploads/${filename}`,
      type: file.type,
      size: file.size,
      uploadDate: new Date()
    };
    
    await db.collection('media').insertOne(mediaDoc);
    
    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        media: mediaDoc
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete media
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Media ID required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    // Get media info
    const media = await db.collection('media').findOne({ id });
    
    if (media) {
      // Delete from filesystem
      try {
        const fs = require('fs');
        const filepath = join(process.cwd(), 'public', media.path);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
        }
      } catch (fsError) {
        console.error('Error deleting file:', fsError);
      }
    }
    
    // Delete from database
    await db.collection('media').deleteOne({ id });
    
    return NextResponse.json(
      { message: 'Media deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
