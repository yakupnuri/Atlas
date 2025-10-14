import { NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    const result = await createSession(username, password);
    
    if (result.success) {
      return NextResponse.json(result, { headers: corsHeaders });
    }
    
    return NextResponse.json(
      { error: result.error },
      { status: 401, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
