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

// GET - Fetch all donation campaigns
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    const db = await getDb();
    
    let query = {};
    if (active === 'true') {
      query.status = 'active';
    }
    
    const campaigns = await db.collection('donation_campaigns')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Calculate total donated for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
        const donations = await db.collection('donations')
          .find({ campaignId: campaign.id, status: 'completed' })
          .toArray();
        
        const totalDonated = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const donorCount = donations.length;
        
        return {
          ...campaign,
          totalDonated,
          donorCount,
          progress: campaign.targetAmount ? (totalDonated / campaign.targetAmount) * 100 : 0
        };
      })
    );
    
    return NextResponse.json({ campaigns: campaignsWithStats }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching donation campaigns:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST - Create new donation campaign (admin only)
export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const campaignData = await request.json();
    
    const db = await getDb();
    
    const newCampaign = {
      id: require('crypto').randomUUID(),
      ...campaignData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await db.collection('donation_campaigns').insertOne(newCampaign);
    
    return NextResponse.json(
      { message: 'Campaign created successfully', campaign: newCampaign },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating donation campaign:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - Update donation campaign (admin only)
export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    await db.collection('donation_campaigns').updateOne(
      { id },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      }
    );
    
    return NextResponse.json(
      { message: 'Campaign updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating donation campaign:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - Delete donation campaign (admin only)
export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID required' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    const db = await getDb();
    
    await db.collection('donation_campaigns').deleteOne({ id });
    
    return NextResponse.json(
      { message: 'Campaign deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting donation campaign:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
