import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    
    console.log('Starting curated recipes import...');

    // Read data files
    const recipesPath = join(process.cwd(), 'curated-recipes.json');
    const categoriesPath = join(process.cwd(), 'curated-categories.json');
    const tagsPath = join(process.cwd(), 'curated-tags.json');

    const recipes = JSON.parse(readFileSync(recipesPath, 'utf-8'));
    const categories = JSON.parse(readFileSync(categoriesPath, 'utf-8'));
    const tags = JSON.parse(readFileSync(tagsPath, 'utf-8'));

    console.log(`Importing ${recipes.length} recipes, ${categories.length} categories, ${tags.length} tags`);

    // Import categories
    console.log('Importing categories...');
    const categoryBatch = adminDb.batch();
    categories.forEach((category: any) => {
      const docRef = adminDb.collection('curated-categories').doc(category.id);
      categoryBatch.set(docRef, category);
    });
    await categoryBatch.commit();
    console.log('Categories imported successfully');

    // Import tags
    console.log('Importing tags...');
    const tagBatch = adminDb.batch();
    tags.forEach((tag: any) => {
      const docRef = adminDb.collection('curated-tags').doc(tag.id);
      tagBatch.set(docRef, tag);
    });
    await tagBatch.commit();
    console.log('Tags imported successfully');

    // Import recipes in batches
    console.log('Importing recipes...');
    const batchSize = 500;
    const totalBatches = Math.ceil(recipes.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, recipes.length);
      const batch = adminDb.batch();
      
      console.log(`Processing batch ${i + 1}/${totalBatches} (recipes ${start + 1}-${end})`);
      
      for (let j = start; j < end; j++) {
        const recipe = recipes[j];
        const docRef = adminDb.collection('curated-recipes').doc(recipe.id);
        batch.set(docRef, recipe);
      }
      
      await batch.commit();
      console.log(`Batch ${i + 1} committed successfully`);
    }

    return NextResponse.json({
      success: true,
      message: 'Import completed successfully',
      data: {
        recipes: recipes.length,
        categories: categories.length,
        tags: tags.length
      }
    });

  } catch (error: any) {
    console.error('Error importing curated recipes:', error);
    return NextResponse.json(
      { error: error.message || 'Import failed' },
      { status: 500 }
    );
  }
}
