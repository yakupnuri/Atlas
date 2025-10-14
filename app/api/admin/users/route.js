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
  if (!token) {
    console.log('No token provided');
    return null;
  }
  
  // Demo token için fallback
  if (token === 'demo-admin-token') {
    return {
      id: '1',
      username: 'admin',
      role: 'super_admin'
    };
  }
  
  try {
    const db = await getDb();
    
    // Token ile kullanıcı ara
    const admin = await db.collection('admins').findOne({ token });
    
    if (admin) {
      console.log('Admin found by token:', admin.username);
      return admin;
    }
    
    // Token pattern: "token-{userId}-{timestamp}" - userId'den kullanıcı bul
    if (token.startsWith('token-')) {
      const parts = token.split('-');
      if (parts.length >= 2) {
        const userId = parts.slice(1, -1).join('-'); // Son timestamp hariç ortadaki kısım user id
        console.log('Trying to find user by ID:', userId);
        
        const adminById = await db.collection('admins').findOne({ id: userId });
        if (adminById) {
          console.log('Admin found by ID:', adminById.username);
          return adminById;
        }
      }
    }
    
    console.log('No admin found for token');
    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
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
