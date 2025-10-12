import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get settings
export async function GET() {
  try {
    const db = await getDb();
    let settings = await db.collection('settings').findOne({ type: 'app_settings' });
    
    // Default settings if not exists
    if (!settings) {
      settings = {
        type: 'app_settings',
        site: {
          title: 'Stichting Atlas',
          description: 'Interculturele ontmoeting en educatie',
          logo: '/web-logo.png',
          favicon: '/favicon.ico',
          contact: {
            email: 'info@stichtingatlas.nl',
            phone: '+31 20 123 4567',
            address: 'Amsterdam, Nederland'
          }
        },
        database: {
          status: 'connected',
          url: process.env.MONGO_URL ? '✓ Configured' : '✗ Not configured'
        },
        apis: {
          google_oauth: {
            enabled: true,
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            redirect_uri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : ''
          },
          unsplash: {
            enabled: false,
            accessKey: ''
          },
          google: {
            mapsKey: '',
            analyticsId: ''
          },
          smtp: {
            host: '',
            port: 587,
            user: '',
            password: '',
            from: 'noreply@stichtingatlas.nl'
          }
        },
        social: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: ''
        },
        seo: {
          metaTitle: 'Stichting Atlas - Interculturele Ontmoeting',
          metaDescription: 'Stichting Atlas bevordert interculturele ontmoeting en educatie in Nederland',
          keywords: 'intercultureel, educatie, Nederland, ontmoeting'
        }
      };
    }
    
    return NextResponse.json({ settings }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update settings
export async function PUT(request) {
  try {
    const data = await request.json();
    const db = await getDb();
    
    // Remove _id from update data
    const { _id, ...updateData } = data;
    
    await db.collection('settings').updateOne(
      { type: 'app_settings' },
      { 
        $set: {
          type: 'app_settings',
          ...updateData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json(
      { message: 'Settings updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
