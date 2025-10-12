import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function GET(request) {
  try {
    const db = await getDb()
    const anbiCollection = db.collection('anbi_documents')

    // Fetch all documents
    const docs = await anbiCollection.find({}).toArray()

    // Transform to object with document types as keys
    const documents = {}
    docs.forEach(doc => {
      documents[doc.type] = {
        fileName: doc.fileName,
        url: doc.url,
        uploadedAt: doc.uploadedAt
      }
    })

    return NextResponse.json({
      success: true,
      documents
    })
  } catch (error) {
    console.error('Error fetching ANBI documents:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, fileName, fileData, fileSize } = body

    // Validate required fields
    if (!type || !fileName || !fileData) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate document type
    const validTypes = ['beleidsplan', 'huisstijl', 'jaarrekening']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'anbi')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const newFileName = `${type}_${timestamp}_${safeFileName}`
    const filePath = path.join(uploadsDir, newFileName)

    // Convert base64 to buffer and write file
    const buffer = Buffer.from(fileData, 'base64')
    await writeFile(filePath, buffer)

    // Store document info in database
    const db = await connectDB()
    const anbiCollection = db.collection('anbi_documents')

    const documentData = {
      type,
      fileName,
      storedFileName: newFileName,
      url: `/uploads/anbi/${newFileName}`,
      fileSize,
      uploadedAt: new Date().toISOString()
    }

    // Update or insert document
    await anbiCollection.updateOne(
      { type },
      { $set: documentData },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        fileName,
        url: documentData.url,
        uploadedAt: documentData.uploadedAt
      }
    })
  } catch (error) {
    console.error('Error uploading ANBI document:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload document: ' + error.message },
      { status: 500 }
    )
  }
}
