import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const client = new MongoClient(process.env.MONGO_URL);

// GET - Fetch all hero slides
export async function GET(request) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let query = {};
    if (activeOnly) {
      query.isActive = true;
    }
    
    const slides = await db.collection('hero_slides')
      .find(query)
      .sort({ order: 1 })
      .toArray();
    
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slides' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST - Create new slide
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, subtitle, description, image, ctaText, ctaLink, order, isActive } = body;
    
    if (!title || !image) {
      return NextResponse.json(
        { error: 'Title and image are required' },
        { status: 400 }
      );
    }
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const newSlide = {
      id: uuidv4(),
      title,
      subtitle: subtitle || '',
      description: description || '',
      image,
      ctaText: ctaText || 'Lees Meer',
      ctaLink: ctaLink || '/',
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.collection('hero_slides').insertOne(newSlide);
    
    console.log(`✅ New hero slide created: ${title}`);
    
    return NextResponse.json({
      success: true,
      slide: newSlide
    });
    
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create slide' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT - Update slide
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // ID'yi body'den veya query parameter'dan al
    const { searchParams } = new URL(request.url);
    const id = body.id || searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      );
    }
    
    // ID'yi body'den çıkar
    const { id: _, ...updateData } = body;
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    updateData.updatedAt = new Date();
    
    const result = await db.collection('hero_slides').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Hero slide updated: ${id}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE - Delete a slide
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Slide ID is required' },
        { status: 400 }
      );
    }
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const result = await db.collection('hero_slides').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Hero slide deleted: ${id}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
