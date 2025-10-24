import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationArticle } from '@/types/education';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Find article by slug
    const querySnapshot = await articlesRef
      .where('slug', '==', slug)
      .where('status', '==', 'published')
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    const article: EducationArticle = {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      category: data.category,
      difficulty: data.difficulty,
      readingTime: data.readingTime,
      tags: data.tags || [],
      author: data.author,
      publishedAt: data.publishedAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      status: data.status,
      seo: data.seo,
      stats: data.stats || { views: 0, likes: 0, shares: 0 },
    };

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error fetching education article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Add authentication check for admin users
    const { slug } = params;
    const body = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Find article by slug
    const querySnapshot = await articlesRef.where('slug', '==', slug).get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const docRef = querySnapshot.docs[0].ref;

    // Update article
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    await docRef.update(updateData);

    return NextResponse.json({
      message: 'Article updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating education article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // TODO: Add authentication check for admin users
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Article slug is required' },
        { status: 400 }
      );
    }

    const { adminDb } = initializeFirebaseServer();
    const articlesRef = adminDb.collection('education_articles');

    // Find article by slug
    const querySnapshot = await articlesRef.where('slug', '==', slug).get();

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const docRef = querySnapshot.docs[0].ref;

    // Soft delete by updating status to 'archived'
    await docRef.update({
      status: 'archived',
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Article deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting education article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
