import { NextResponse } from 'next/server'

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_ACCESS_KEY'

// GET - Search Unsplash
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || 'nature'
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '20')
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )
    
    if (!response.ok) {
      throw new Error('Unsplash API error')
    }
    
    const data = await response.json()
    
    // Transform to our format
    const results = data.results.map(photo => ({
      id: photo.id,
      title: photo.description || photo.alt_description || 'Untitled',
      alt: photo.alt_description || '',
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      full: photo.urls.full,
      author: photo.user.name,
      authorLink: photo.user.links.html,
      source: 'unsplash',
      unsplashData: {
        download_location: photo.links.download_location
      }
    }))
    
    return NextResponse.json({ 
      success: true, 
      data: results,
      total: data.total,
      page: page
    })
  } catch (error) {
    console.error('Unsplash Search Error:', error)
    return NextResponse.json(
      { error: 'Failed to search Unsplash', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Import from Unsplash to our library
export async function POST(request) {
  try {
    const body = await request.json()
    const { unsplashPhoto } = body
    
    if (!unsplashPhoto) {
      return NextResponse.json({ error: 'No photo data provided' }, { status: 400 })
    }
    
    // Trigger download endpoint (Unsplash requires this for analytics)
    if (unsplashPhoto.unsplashData?.download_location) {
      await fetch(unsplashPhoto.unsplashData.download_location, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      })
    }
    
    // Save to our database
    const { getDb } = require('@/lib/mongodb')
    const { v4: uuidv4 } = require('uuid')
    
    const db = await getDb()
    const collection = db.collection('media_library')
    
    const mediaData = {
      id: uuidv4(),
      title: unsplashPhoto.title,
      alt: unsplashPhoto.alt,
      url: unsplashPhoto.url,
      thumbUrl: unsplashPhoto.thumb,
      fileName: `unsplash-${unsplashPhoto.id}.jpg`,
      fileSize: 0, // Unknown for Unsplash
      mimeType: 'image/jpeg',
      type: 'image',
      source: 'unsplash',
      unsplashId: unsplashPhoto.id,
      author: unsplashPhoto.author,
      authorLink: unsplashPhoto.authorLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    await collection.insertOne(mediaData)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Photo imported from Unsplash',
      data: mediaData 
    })
  } catch (error) {
    console.error('Unsplash Import Error:', error)
    return NextResponse.json(
      { error: 'Failed to import from Unsplash', details: error.message },
      { status: 500 }
    )
  }
}
