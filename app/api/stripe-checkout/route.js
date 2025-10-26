import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const db = await getDb();
    const { amount, donorName, donorEmail } = await request.json();
    
    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Geçersiz bağış miktarı' },
        { status: 400 }
      );
    }
    
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
    
    // Initialize Stripe with the secret key
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2023-10-16',
    });
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Bağış - Stichting Atlas',
              description: 'Desteğiniz için teşekkür ederiz!',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/doneren/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/doneren`,
      customer_email: donorEmail || undefined,
      metadata: {
        donorName: donorName || 'Anoniem',
        mode: stripeConfig.mode || 'test'
      }
    });
    
    // Store transaction in database
    const donationsCollection = db.collection('donations');
    await donationsCollection.insertOne({
      id: uuidv4(),
      sessionId: session.id,
      amount: amount,
      currency: 'eur',
      donorName: donorName || 'Anoniem',
      donorEmail: donorEmail || '',
      status: 'pending',
      mode: stripeConfig.mode || 'test',
      createdAt: new Date().toISOString()
    });
    
    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Ödeme oturumu oluşturulamadı: ' + error.message },
      { status: 500 }
    );
  }
}
