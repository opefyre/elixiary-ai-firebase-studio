const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');

if (!serviceAccount.project_id) {
  console.error('Firebase service account not configured');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

async function fixUserSubscription() {
  const userId = 'rwXgJysLFyPOurc2e9qLKK5gg8I3';
  
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.error('User not found');
      return;
    }
    
    const currentData = userDoc.data();
    console.log('Current user data:', currentData);
    
    // Update user to Pro status
    const updateData = {
      subscriptionTier: 'pro',
      subscriptionStatus: 'active',
      stripeCustomerId: 'cus_TDYYkcAxWOkiUH', // You'll need to get the actual customer ID
      stripeSubscriptionId: 'sub_1QZqXZ2eZvKYlo2C1234567890', // You'll need to get the actual subscription ID
      subscriptionStartDate: new Date().toISOString(),
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
      lastWebhookEvent: 'manual_fix',
      webhookSignature: 'manual_fix',
    };
    
    // Create audit trail entry
    const auditEntry = {
      timestamp: new Date(),
      event: 'manual_fix',
      from: currentData,
      to: updateData,
      source: 'manual',
      webhookId: 'manual_fix',
    };
    
    // Add to subscription history
    const existingHistory = currentData.subscriptionHistory || [];
    updateData.subscriptionHistory = [...existingHistory, auditEntry].slice(-50);
    
    await userRef.update(updateData);
    console.log('✅ User subscription fixed successfully');
    console.log('Updated fields:', Object.keys(updateData));
    
  } catch (error) {
    console.error('Error fixing subscription:', error);
  } finally {
    process.exit(0);
  }
}

fixUserSubscription();
