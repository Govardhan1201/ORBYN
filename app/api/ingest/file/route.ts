import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { ingestItem } from '@/lib/services/ingestion/core.service';
import { uploadFile } from '@/lib/upload/storage';
import clientPromise from '@/lib/db/mongodb';
import pdfParse from 'pdf-parse';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    await clientPromise; // Ensure DB connection

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';
    let itemType: 'document' | 'image' | 'video' = 'document';

    // 1. Extract text if PDF
    if (file.type === 'application/pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (e) {
        console.error('Failed to parse PDF', e);
      }
    } else if (file.type.startsWith('image/')) {
      itemType = 'image';
      // Basic OCR could go here if enabled
    } else if (file.type.startsWith('video/')) {
      itemType = 'video';
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    // 2. Upload to Cloudinary
    const uploadResult = await uploadFile(buffer, {
      filename: file.name,
      folder: itemType === 'document' ? 'documents' : 'media',
      resourceType: itemType === 'document' ? 'raw' : 'auto'
    });

    // 3. Process through unified ingestion pipeline
    const title = file.name.replace(/\.[^/.]+$/, ""); // strip extension
    const contentToAnalyze = extractedText || `Media file: ${file.name}`;
    
    const result = await ingestItem({
      userId: session.user.id,
      type: itemType,
      title,
      url: uploadResult.url,
      filePath: uploadResult.url,
      filePublicId: uploadResult.publicId,
      content: contentToAnalyze,
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('File Ingestion Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
