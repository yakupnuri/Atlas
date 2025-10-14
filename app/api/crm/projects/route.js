import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// No email domain check needed for CRM
// CRM is password-protected, not email-restricted

// GET /api/crm/projects - Fetch all projects
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get('publicOnly') === 'true';
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    let query = {};
    
    // Public filter
    if (publicOnly) {
      query.public = true;
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const projects = await db
      .collection('crm_projects')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Projeler yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/crm/projects - Create new project (CRM password protected)
export async function POST(request) {
  try {
    // For CRM, we rely on client-side password authentication
    // No server-side session check needed

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.category || !data.status) {
      return NextResponse.json(
        { error: 'Başlık, kategori ve durum zorunludur' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const newProject = {
      id: uuidv4(),
      title: data.title,
      description: data.description || '',
      category: data.category,
      status: data.status,
      team: data.team || [],
      budget: data.budget || 0,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      image: data.image || '',
      documents: data.documents || [],
      public: data.public !== undefined ? data.public : false,
      progress: data.progress || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'CRM User'
    };

    await db.collection('crm_projects').insertOne(newProject);

    return NextResponse.json({ 
      message: 'Proje başarıyla oluşturuldu',
      project: newProject 
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Proje oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT /api/crm/projects - Update project (CRM password protected)
export async function PUT(request) {
  try {
    // For CRM, we rely on client-side password authentication

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json(
        { error: 'Proje ID gereklidir' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const updateData = {
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      team: data.team || [],
      budget: data.budget || 0,
      startDate: data.startDate,
      endDate: data.endDate,
      image: data.image || '',
      documents: data.documents || [],
      public: data.public !== undefined ? data.public : false,
      progress: data.progress || 0,
      updatedAt: new Date().toISOString()
    };

    const result = await db
      .collection('crm_projects')
      .updateOne({ id: data.id }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Proje başarıyla güncellendi',
      project: { id: data.id, ...updateData }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Proje güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/crm/projects - Delete project (admin only, @stichtingatlas.com)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    // Check if user has @stichtingatlas.com email
    if (!isAtlasEmail(session.user.email)) {
      return NextResponse.json(
        { error: 'Bu işlem için @stichtingatlas.com e-posta adresi gereklidir' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Proje ID gereklidir' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('stichting_atlas');
    
    const result = await db
      .collection('crm_projects')
      .deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Proje başarıyla silindi' 
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Proje silinirken hata oluştu' },
      { status: 500 }
    );
  }
}
