import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const client = new MongoClient(process.env.MONGO_URL);

// GET - Fetch all contact messages (Admin only)
export async function GET(request) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }
    
    const messages = await db.collection('contact_messages')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// POST - Submit new contact message
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const newMessage = {
      id: uuidv4(),
      name,
      email,
      phone: phone || '',
      subject: subject || 'Geen onderwerp',
      message,
      status: 'new', // new, read, replied, archived
      createdAt: new Date(),
      repliedAt: null,
      reply: null,
    };
    
    await db.collection('contact_messages').insertOne(newMessage);
    
    console.log(`✅ New contact message from: ${name} (${email})`);
    
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      id: newMessage.id
    });
    
  } catch (error) {
    console.error('Error submitting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// PUT - Update message status or add reply
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, status, reply } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const updateData = {};
    if (status) updateData.status = status;
    if (reply) {
      updateData.reply = reply;
      updateData.repliedAt = new Date();
    }
    
    const result = await db.collection('contact_messages').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Contact message updated: ${id}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// DELETE - Delete a contact message
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    const result = await db.collection('contact_messages').deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }
    
    console.log(`✅ Contact message deleted: ${id}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
