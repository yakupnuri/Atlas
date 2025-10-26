import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// GET - Fetch Stripe publishable key from settings
export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('homepage_content');
    
    // Fetch homepage content with integrations
    const content = await collection.findOne({ type: 'homepage' });
    
    if (!content || !content.integrations || !content.integrations.stripe) {
      return NextResponse.json(
        { error: 'Stripe configuration not found. Please configure in Settings.' },
        { status: 404 }
      );
    }
    
    const stripeConfig = content.integrations.stripe;
    
    // Validate required fields
    if (!stripeConfig.publishableKey || !stripeConfig.secretKey) {
      return NextResponse.json(
        { error: 'Stripe keys not configured. Please add keys in Settings.' },
        { status: 404 }
      );
    }
    
    // Only return the publishable key and mode to the frontend
    return NextResponse.json({
      publishableKey: stripeConfig.publishableKey,
      mode: stripeConfig.mode || 'test'
    });
  } catch (error) {
    console.error('Error fetching Stripe config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Stripe configuration' },
      { status: 500 }
    );
  }
}
