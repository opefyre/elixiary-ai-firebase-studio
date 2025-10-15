import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    console.log(`Starting usage data migration for user: ${userId}`);

    // Get all AI recipes for this user
    const aiRecipesSnapshot = await adminDb
      .collection(`users/${userId}/recipes`)
      .get();

    // Get all saved curated recipes for this user
    const savedRecipesSnapshot = await adminDb
      .collection('user-saved-recipes')
      .where('userId', '==', userId)
      .get();

    console.log(`Found ${aiRecipesSnapshot.docs.length} AI recipes`);
    console.log(`Found ${savedRecipesSnapshot.docs.length} saved curated recipes`);

    // Group recipes by date
    const dailyData: { [date: string]: { generated: number; saved: number } } = {};

    // Process AI recipes
    aiRecipesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.() || new Date();
      const dateStr = createdAt.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { generated: 0, saved: 0 };
      }
      dailyData[dateStr].generated += 1;
    });

    // Process saved curated recipes
    savedRecipesSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const savedAt = data.savedAt?.toDate?.() || new Date();
      const dateStr = savedAt.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { generated: 0, saved: 0 };
      }
      dailyData[dateStr].saved += 1;
    });

    console.log('Daily data grouped:', dailyData);

    // Create daily usage documents
    const batch = adminDb.batch();
    let documentsCreated = 0;

    Object.entries(dailyData).forEach(([date, counts]) => {
      const usageRef = doc(adminDb, `users/${userId}/dailyUsage/${date}`);
      batch.set(usageRef, {
        date,
        recipesGenerated: counts.generated,
        recipesSaved: counts.saved,
        lastUpdated: serverTimestamp(),
      });
      documentsCreated++;
    });

    await batch.commit();

    console.log(`Migration completed! Created ${documentsCreated} daily usage documents`);

    return NextResponse.json({
      success: true,
      message: `Migration completed successfully`,
      documentsCreated,
      totalGenerated: Object.values(dailyData).reduce((sum, day) => sum + day.generated, 0),
      totalSaved: Object.values(dailyData).reduce((sum, day) => sum + day.saved, 0),
    });

  } catch (error: any) {
    console.error('Error migrating usage data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to migrate usage data' },
      { status: 500 }
    );
  }
}
