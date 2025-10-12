import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Verify admin token
async function verifyAdmin(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  const db = await getDb();
  const admin = await db.collection('admins').findOne({ token });
  return admin;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Get all users
export async function GET(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const db = await getDb();
    const users = await db.collection('admins')
      .find({})
      .project({ password: 0, token: 0 })
      .toArray();
    
    return NextResponse.json({ users }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Create new user
export async function POST(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { username, password, email, role } = await request.json();
    
    if (!username || !password || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      );
    }

    const db = await getDb();
    
    // Check if user exists
    const existingUser = await db.collection('admins').findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: require('crypto').randomUUID(),
      username,
      password: hashedPassword,
      email,
      role,
      createdAt: new Date(),
      createdBy: admin.username
    };

    await db.collection('admins').insertOne(newUser);
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email, 
          role: newUser.role 
        }
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Update user
export async function PUT(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { userId, username, email, role, password } = await request.json();
    
    const db = await getDb();
    const updateData = { username, email, role };
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    await db.collection('admins').updateOne(
      { id: userId },
      { $set: updateData }
    );
    
    return NextResponse.json(
      { message: 'User updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete user
export async function DELETE(request) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin || admin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const db = await getDb();
    
    // Don't allow deleting yourself
    if (admin.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete yourself' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    await db.collection('admins').deleteOne({ id: userId });
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
