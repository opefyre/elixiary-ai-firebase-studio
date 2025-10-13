import { readFileSync } from 'fs';
import { initializeFirebaseServer } from './src/firebase/server';

async function importCuratedData() {
  try {
    console.log('Starting curated data import...');
    
    const { adminDb } = initializeFirebaseServer();
    
    // Read data files
    const recipes = JSON.parse(readFileSync('curated-recipes.json', 'utf-8'));
    const categories = JSON.parse(readFileSync('curated-categories.json', 'utf-8'));
    const tags = JSON.parse(readFileSync('curated-tags.json', 'utf-8'));

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

    console.log('All data imported successfully!');
    console.log(`✅ ${recipes.length} recipes imported`);
    console.log(`✅ ${categories.length} categories imported`);
    console.log(`✅ ${tags.length} tags imported`);

  } catch (error) {
    console.error('Error importing curated data:', error);
    process.exit(1);
  }
}

// Run import
importCuratedData().then(() => {
  console.log('Import completed successfully!');
  process.exit(0);
}).catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
