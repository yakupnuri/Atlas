import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch all career center data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // announcements, surveys, seminars, jobs
    const includeExpired = searchParams.get('includeExpired') === 'true'; // For admin panel

    const db = await getDb();
    
    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    const collectionName = `career_${type}`;
    const collection = db.collection(collectionName);
    
    let data = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    // Filter expired items for public view
    if (!includeExpired) {
      const now = new Date();
      
      data = data.filter(item => {
        // Filter seminars by date and time
        if (type === 'seminars' && item.date && item.time) {
          const seminarDateTime = new Date(`${item.date}T${item.time}`);
          return seminarDateTime > now;
        }
        
        // Filter jobs by expiry date
        if (type === 'jobs' && item.expiryDate) {
          const expiryDate = new Date(item.expiryDate);
          return expiryDate > now;
        }
        
        // Filter surveys by end date
        if (type === 'surveys' && item.endDate) {
          const endDate = new Date(item.endDate);
          return endDate > now;
        }
        
        // Keep items without expiry dates
        return true;
      });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Career GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new career center item
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
    const collectionName = `career_${type}`;
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
    console.error('Career POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to create item', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update career center item
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
    const collectionName = `career_${type}`;
    const collection = db.collection(collectionName);

    // Remove _id from data if it exists
    const { _id, ...cleanData } = data;

    const updatedItem = {
      ...cleanData,
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
    console.error('Career PUT Error:', error);
    return NextResponse.json(
      { error: 'Failed to update item', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete career center item
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
    const collectionName = `career_${type}`;
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
    console.error('Career DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item', details: error.message },
      { status: 500 }
    );
  }
}
