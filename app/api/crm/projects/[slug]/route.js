import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET /api/crm/projects/[slug] - Get project by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug gereklidir' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'stichting_atlas');
    
    // Convert title to slug format and search
    // Or search by ID if slug is UUID format
    let project;
    
    // First try to find by ID (if slug is UUID)
    project = await db.collection('crm_projects').findOne({ 
      id: slug 
    });
    
    // If not found, try to find by converting title to slug
    if (!project) {
      // Get all public projects and find by slug-converted title
      const projects = await db.collection('crm_projects').find({ 
        public: true 
      }).toArray();
      
      project = projects.find(p => {
        const titleSlug = p.title
          .toLowerCase()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        return titleSlug === slug;
      });
    }
    
    if (!project) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      );
    }
    
    // Only return public projects for non-authenticated users
    if (!project.public) {
      return NextResponse.json(
        { error: 'Bu proje herkese açık değil' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project by slug:', error);
    return NextResponse.json(
      { error: 'Proje yüklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
