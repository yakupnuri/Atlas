import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch all education center data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // announcements, articles, documents, schedule, courses, calendar

    const db = await getDb();
    
    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    const collectionName = `education_${type}`;
    const collection = db.collection(collectionName);
    
    const data = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Education GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new education center item
export async function POST(request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collectionName = `education_${type}`;
    const collection = db.collection(collectionName);

    const newItem = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await collection.insertOne(newItem);

    return NextResponse.json({
      success: true,
      message: 'Item created successfully',
      data: newItem,
    });
  } catch (error) {
    console.error('Education POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update education center item
export async function PUT(request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (!type || !id || !data) {
      return NextResponse.json(
        { error: 'Type, id, and data are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collectionName = `education_${type}`;
    const collection = db.collection(collectionName);

    // Remove _id from update data to avoid MongoDB error
    const { _id, ...updateData } = data;
    
    const updatedItem = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.updateOne(
      { id },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
    });
  } catch (error) {
    console.error('Education PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update item', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete education center item
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and id are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collectionName = `education_${type}`;
    const collection = db.collection(collectionName);

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Education DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item', details: error.message },
      { status: 500 }
    );
  }
}
