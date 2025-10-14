import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch survey responses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId');

    if (!surveyId) {
      return NextResponse.json({ error: 'Survey ID is required' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection('career_survey_responses');
    
    const responses = await collection.find({ surveyId }).sort({ submittedAt: -1 }).toArray();
    
    return NextResponse.json({ success: true, data: responses, count: responses.length });
  } catch (error) {
    console.error('Survey Responses GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responses', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Submit survey response
export async function POST(request) {
  try {
    const body = await request.json();
    const { surveyId, answers, userName, userEmail } = body;

    if (!surveyId || !answers) {
      return NextResponse.json(
        { error: 'Survey ID and answers are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection('career_survey_responses');

    const response = {
      id: uuidv4(),
      surveyId,
      answers,
      userName: userName || 'Anonim',
      userEmail: userEmail || null,
      submittedAt: new Date().toISOString(),
    };

    await collection.insertOne(response);

    return NextResponse.json({
      success: true,
      message: 'Survey response submitted successfully',
    });
  } catch (error) {
    console.error('Survey Response POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit response', details: error.message },
      { status: 500 }
    );
  }
}
