// Simple debug script to check subscription data
// Run this in browser console on your app

console.log('🔍 Debugging Subscription Data...');

// Check current user
const user = firebase.auth().currentUser;
console.log('Current User:', user ? user.uid : 'Not signed in');
console.log('User Email:', user ? user.email : 'N/A');

if (user) {
  // Try to read user document
  firebase.firestore().collection('users').doc(user.uid).get()
    .then(doc => {
      console.log('User Document Exists:', doc.exists);
      if (doc.exists) {
        const data = doc.data();
        console.log('Subscription Data:', {
          subscriptionTier: data.subscriptionTier,
          subscriptionStatus: data.subscriptionStatus,
          stripeCustomerId: data.stripeCustomerId,
          isEarlyBird: data.isEarlyBird,
          earlyBirdNumber: data.earlyBirdNumber
        });
      }
    })
    .catch(error => {
      console.error('Error reading user document:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
    });
    
  // Also try to list all users (this will likely fail due to rules)
  firebase.firestore().collection('users').get()
    .then(snapshot => {
      console.log('Total users:', snapshot.size);
      snapshot.forEach(doc => {
        console.log('User ID:', doc.id);
        const data = doc.data();
        console.log('  - Subscription Tier:', data.subscriptionTier);
        console.log('  - Stripe Customer ID:', data.stripeCustomerId);
      });
    })
    .catch(error => {
      console.error('Error listing users:', error);
    });
}
