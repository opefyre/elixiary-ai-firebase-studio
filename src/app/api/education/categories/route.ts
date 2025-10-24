import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { EducationCategory } from '@/types/education';

export async function GET(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const categoriesRef = adminDb.collection('education_categories');

    // Get all categories ordered by order field
    const snapshot = await categoriesRef.orderBy('order', 'asc').get();
    const categories: EducationCategory[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        order: data.order,
        articleCount: data.articleCount || 0,
      });
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching education categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin users
    const body = await request.json();
    
    const { adminDb } = initializeFirebaseServer();
    const categoriesRef = adminDb.collection('education_categories');

    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'icon', 'color'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const existingCategory = await categoriesRef.where('slug', '==', body.slug).get();
    if (!existingCategory.empty) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }

    // Get the next order number
    const lastCategory = await categoriesRef.orderBy('order', 'desc').limit(1).get();
    const nextOrder = lastCategory.empty ? 1 : lastCategory.docs[0].data().order + 1;

    const categoryData = {
      ...body,
      order: body.order || nextOrder,
      articleCount: 0,
    };

    const docRef = await categoriesRef.add(categoryData);

    return NextResponse.json({
      id: docRef.id,
      message: 'Category created successfully',
    });
  } catch (error: any) {
    console.error('Error creating education category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
