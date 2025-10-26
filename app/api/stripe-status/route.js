import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import Stripe from 'stripe';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID gerekli' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    
    // Get Stripe configuration from database
    const collection = db.collection('homepage_content');
    const content = await collection.findOne({ type: 'homepage' });
    
    if (!content || !content.integrations || !content.integrations.stripe) {
      return NextResponse.json(
        { error: 'Stripe ayarları bulunamadı' },
        { status: 404 }
      );
    }
    
    const stripeConfig = content.integrations.stripe;
    
    // Initialize Stripe
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2023-10-16',
    });
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Update transaction in database
    const donationsCollection = db.collection('donations');
    const existingDonation = await donationsCollection.findOne({ sessionId });
    
    if (existingDonation && existingDonation.status !== session.payment_status) {
      await donationsCollection.updateOne(
        { sessionId },
        { 
          $set: { 
            status: session.payment_status,
            paymentIntent: session.payment_intent,
            updatedAt: new Date().toISOString()
          } 
        }
      );
    }
    
    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      amount: session.amount_total / 100,
      customer_email: session.customer_email
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Ödeme durumu kontrol edilemedi' },
      { status: 500 }
    );
  }
}
