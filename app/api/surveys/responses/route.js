import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendNewResponseEmail, sendUserConfirmationEmail } from '@/lib/emailService';

// GET - Fetch survey responses
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId');
    
    if (!surveyId) {
      return NextResponse.json(
        { success: false, error: 'Survey ID is required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const collection = db.collection('survey_responses');
    
    const responses = await collection.find({ surveyId }).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true, 
      data: responses,
      count: responses.length
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch responses', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Submit survey response
export async function POST(request) {
  try {
    const body = await request.json();
    const { surveyId, answers, userName, userEmail } = body;
    
    if (!surveyId || !answers || answers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Survey ID and answers are required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const collection = db.collection('survey_responses');
    
    const response = {
      id: uuidv4(),
      surveyId,
      answers, // [{ questionId, question, answer }]
      userName: userName || 'Anoniem',
      userEmail: userEmail || '',
      submittedAt: new Date().toISOString()
    };
    
    await collection.insertOne(response);
    
    // Fetch survey data for email
    const surveysCollection = db.collection('surveys');
    const survey = await surveysCollection.findOne({ id: surveyId });
    
    // Send emails (async, don't wait)
    if (survey) {
      const adminEmail = process.env.ADMIN_EMAIL;
      
      // Admin notification
      if (adminEmail) {
        sendNewResponseEmail(survey, response, adminEmail, 'nl').catch(err => 
          console.error('Admin email failed:', err)
        );
      }
      
      // User confirmation
      if (response.userEmail) {
        sendUserConfirmationEmail(survey, response, 'nl').catch(err => 
          console.error('User confirmation email failed:', err)
        );
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Response submitted successfully',
      data: response
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit response', details: error.message },
      { status: 500 }
    );
  }
}
