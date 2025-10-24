import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendSurveyCreatedEmail } from '@/lib/emailService';

// GET - Fetch surveys (filtered by module)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module'); // career, education, projects, all
    const includeExpired = searchParams.get('includeExpired') === 'true';
    
    const db = await getDb();
    const collection = db.collection('surveys');
    
    let query = {};
    if (module && module !== 'all') {
      query.module = module;
    }
    
    let data = await collection.find(query).sort({ createdAt: -1 }).toArray();
    
    // Filter expired surveys
    if (!includeExpired) {
      const now = new Date();
      data = data.filter(item => {
        if (item.endDate) {
          const endDate = new Date(item.endDate);
          return endDate > now;
        }
        return true;
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      data,
      count: data.length
    });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch surveys', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new survey
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, module, questions, endDate, image } = body;
    
    if (!title || !module || !questions || questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Title, module, and questions are required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const collection = db.collection('surveys');
    
    const survey = {
      id: uuidv4(),
      title,
      description: description || '',
      module, // career, education, projects
      questions, // [{ id, text, type, options, required }]
      image: image || '',
      endDate: endDate || null,
      isActive: true,
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await collection.insertOne(survey);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Survey created successfully',
      data: survey
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create survey', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update survey
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Survey ID is required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const collection = db.collection('surveys');
    
    const { _id, ...cleanData } = updateData;
    
    const result = await collection.updateOne(
      { id },
      { 
        $set: { 
          ...cleanData,
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Survey not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Survey updated successfully'
    });
  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update survey', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete survey
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Survey ID is required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const collection = db.collection('surveys');
    
    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Survey not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Survey deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete survey', details: error.message },
      { status: 500 }
    );
  }
}
