import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    const db = await getDb();
    
    // Get article
    const article = await db.collection('news').findOne({ slug });
    
    if (!article) {
      return NextResponse.json(
        { error: 'Haber bulunamadı' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Get comments if enabled
    let comments = [];
    if (article.commentsEnabled) {
      comments = await db.collection('comments')
        .find({ articleId: article.id, approved: true })
        .sort({ createdAt: -1 })
        .toArray();
    }
    
    // Get prev/next articles
    const allArticles = await db.collection('news')
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    const currentIndex = allArticles.findIndex(a => a.slug === slug);
    const prev = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
    const next = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
    
    return NextResponse.json(
      { 
        article, 
        comments,
        prev: prev ? { id: prev.id, slug: prev.slug, title: prev.title } : null,
        next: next ? { id: next.id, slug: next.slug, title: next.title } : null
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
