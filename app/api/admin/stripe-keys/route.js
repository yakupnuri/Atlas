import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Helper to mask API keys for security
function maskApiKey(key) {
  if (!key) return null;
  
  if (key.length <= 12) {
    return '***' + key.substring(key.length - 4);
  }
  
  const firstPart = key.substring(0, 8);
  const lastPart = key.substring(key.length - 4);
  return `${firstPart}...${lastPart}`;
}

// Get Stripe settings
export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    const settings = await db.collection('settings').findOne({ type: 'app_settings' });
    
    if (!settings || !settings.apis || !settings.apis.stripe) {
      return NextResponse.json({
        enabled: false,
        mode: 'test',
        publishableKey: null,
        secretKey: null,
        webhookSecret: null,
      }, { headers: corsHeaders });
    }
    
    const stripeSettings = settings.apis.stripe;
    
    return NextResponse.json({
      enabled: stripeSettings.enabled || false,
      mode: stripeSettings.mode || 'test',
      publishableKey: maskApiKey(stripeSettings.publishableKey),
      secretKey: maskApiKey(stripeSettings.secretKey),
      webhookSecret: maskApiKey(stripeSettings.webhookSecret),
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching Stripe settings:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update Stripe settings
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const body = await request.json();
    const { enabled, mode, publishableKey, secretKey, webhookSecret } = body;
    
    // Validate mode
    if (mode && mode !== 'test' && mode !== 'live') {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "test" or "live"' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Validate key formats if provided
    if (publishableKey && mode) {
      const expectedPrefix = mode === 'test' ? 'pk_test_' : 'pk_live_';
      if (!publishableKey.startsWith(expectedPrefix)) {
        return NextResponse.json(
          { error: `Invalid publishable key format. Expected ${expectedPrefix}...` },
          { status: 400, headers: corsHeaders }
        );
      }
    }
    
    if (secretKey && mode) {
      const expectedPrefix = mode === 'test' ? 'sk_test_' : 'sk_live_';
      if (!secretKey.startsWith(expectedPrefix)) {
        return NextResponse.json(
          { error: `Invalid secret key format. Expected ${expectedPrefix}...` },
          { status: 400, headers: corsHeaders }
        );
      }
    }
    
    if (webhookSecret && !webhookSecret.startsWith('whsec_')) {
      return NextResponse.json(
        { error: 'Invalid webhook secret format. Expected whsec_...' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    // Get current settings
    const currentSettings = await db.collection('settings').findOne({ type: 'app_settings' });
    
    // Prepare update object
    const updateData = {
      'apis.stripe.enabled': enabled !== undefined ? enabled : false,
      'apis.stripe.mode': mode || 'test',
      'apis.stripe.updatedAt': new Date(),
    };
    
    // Only update keys if they are provided (not empty)
    if (publishableKey) {
      updateData['apis.stripe.publishableKey'] = publishableKey;
    }
    
    if (secretKey) {
      updateData['apis.stripe.secretKey'] = secretKey;
    }
    
    if (webhookSecret) {
      updateData['apis.stripe.webhookSecret'] = webhookSecret;
    }
    
    await db.collection('settings').updateOne(
      { type: 'app_settings' },
      { $set: updateData },
      { upsert: true }
    );
    
    return NextResponse.json(
      { success: true, message: 'Stripe settings updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating Stripe settings:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
