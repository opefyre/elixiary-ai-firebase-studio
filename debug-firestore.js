const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = getFirestore(app);

async function debugFirestore() {
  try {
    console.log('🔍 Debugging Firestore...');
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Service Account Email:', serviceAccount.client_email);
    
    // List all collections
    console.log('\n📁 Collections:');
    const collections = await db.listCollections();
    console.log('Collections found:', collections.map(c => c.id));
    
    // Check users collection
    if (collections.some(c => c.id === 'users')) {
      console.log('\n👥 Users Collection:');
      const usersSnapshot = await db.collection('users').get();
      console.log(`Found ${usersSnapshot.size} user documents`);
      
      usersSnapshot.forEach(doc => {
        console.log(`\nUser ID: ${doc.id}`);
        const data = doc.data();
        console.log('Data keys:', Object.keys(data));
        console.log('Subscription Tier:', data.subscriptionTier);
        console.log('Subscription Status:', data.subscriptionStatus);
        console.log('Stripe Customer ID:', data.stripeCustomerId);
        console.log('Is Early Bird:', data.isEarlyBird);
        console.log('Created At:', data.createdAt);
        console.log('Updated At:', data.updatedAt);
      });
    }
    
    // Check config collection
    if (collections.some(c => c.id === 'config')) {
      console.log('\n⚙️ Config Collection:');
      const configSnapshot = await db.collection('config').get();
      console.log(`Found ${configSnapshot.size} config documents`);
      
      configSnapshot.forEach(doc => {
        console.log(`\nConfig: ${doc.id}`);
        console.log('Data:', doc.data());
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

debugFirestore();
