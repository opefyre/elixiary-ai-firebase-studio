'use client';

import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Use the hooks directly
  let firebaseServices, userServices, auth;
  try {
    firebaseServices = useFirebase();
    userServices = useUser();
    auth = firebaseServices.auth;
  } catch (error: any) {
    setFirebaseError(error.message);
  }

  useEffect(() => {
    async function runDebug() {
      if (firebaseError || !firebaseServices || !userServices) return;

      const { firestore, auth } = firebaseServices;
      const { user, isUserLoading, userError } = userServices;

      if (isUserLoading) return;
      if (userError) {
        setDebugInfo({ userError: userError.message });
        return;
      }
      if (!user || !firestore) return;

      try {
        // Get current user info
        const currentUserInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };

        console.log('=== DEBUG INFO ===');
        console.log('Current User ID:', user.uid);
        console.log('User Email:', user.email);
        console.log('Auth Token:', await user.getIdToken());
        console.log('Expected User ID:', 'uzyFZtgGRAZZUlqc3j7c42PUHgk1');
        console.log('IDs Match:', user.uid === 'uzyFZtgGRAZZUlqc3j7c42PUHgk1');
        console.log('Firestore instance:', firestore);
        console.log('Firebase Auth instance:', auth);

        // Try to read user document (Firebase v9+ syntax)
        const userDocRef = doc(firestore, 'users', user.uid);
        console.log('User document reference:', userDocRef);
        console.log('User document path:', userDocRef.path);
        console.log('Attempting to read user document for:', user.uid);
        
        let userDoc;
        try {
          userDoc = await getDoc(userDocRef);
          console.log('User document exists:', userDoc.exists());
          if (userDoc.exists()) {
            console.log('User document data:', userDoc.data());
          } else {
            console.log('User document does not exist');
          }
        } catch (docError: any) {
          console.error('Error reading user document:', docError);
          console.error('Error code:', docError.code);
          console.error('Error message:', docError.message);
          throw docError;
        }
        
        // Create the debug info object
        const debugData: any = {
          currentUser: currentUserInfo,
          currentUserDocument: {
            exists: userDoc.exists(),
            data: userDoc.exists() ? userDoc.data() : null,
          },
          firebaseConfig: {
            projectId: firestore.app.options.projectId,
          },
          userIdMatch: user.uid === 'uzyFZtgGRAZZUlqc3j7c42PUHgk1',
          webhookUserId: 'uzyFZtgGRAZZUlqc3j7c42PUHgk1',
        };

        // Only try to read webhook user document if we have permission (same user)
        if (user.uid === 'uzyFZtgGRAZZUlqc3j7c42PUHgk1') {
          const webhookUserDocRef = doc(firestore, 'users', 'uzyFZtgGRAZZUlqc3j7c42PUHgk1');
          const webhookUserDoc = await getDoc(webhookUserDocRef);
          debugData.webhookUserDocument = {
            exists: webhookUserDoc.exists(),
            data: webhookUserDoc.exists() ? webhookUserDoc.data() : null,
          };
        } else {
          debugData.webhookUserDocument = {
            note: 'Cannot access - permission denied (different user)',
          };
        }

        setDebugInfo(debugData);
      } catch (error: any) {
        setDebugInfo({
          error: {
            message: error.message,
            code: error.code,
            stack: error.stack,
          },
        });
      }
    }

    runDebug();
  }, [firebaseServices, userServices, firebaseError]);

  if (firebaseError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Firebase Initialization Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">{firebaseError}</p>
        </div>
      </div>
    );
  }

  if (!firebaseServices || !userServices) {
    return <div className="p-8">Loading debug info...</div>;
  }

  const { user, isUserLoading, userError } = userServices;

  if (isUserLoading) {
    return <div className="p-8">Loading user...</div>;
  }

  if (userError) {
    return <div className="p-8">Auth Error: {userError.message}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Firebase Debug Information</h1>
      
      {debugInfo && (
        <div className="space-y-6">
          <div className="bg-blue-100 p-4 rounded border-2 border-blue-500">
            <h2 className="text-lg font-semibold mb-2 text-blue-900">🔑 Current User (YOU)</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.currentUser, null, 2)}</pre>
          </div>

          <div className="bg-purple-100 p-4 rounded border-2 border-purple-500">
            <h2 className="text-lg font-semibold mb-2 text-purple-900">💳 Webhook User (from Stripe payment)</h2>
            <pre className="text-sm">{JSON.stringify({ userId: debugInfo.webhookUserId }, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Firebase Config</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.firebaseConfig, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Current User Document</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.currentUserDocument, null, 2)}</pre>
          </div>

          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Webhook User Document (uzyFZtgGRAZZUlqc3j7c42PUHgk1)</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.webhookUserDocument, null, 2)}</pre>
          </div>

          <div className={`${debugInfo.userIdMatch ? 'bg-green-100' : 'bg-yellow-100'} p-4 rounded`}>
            <h2 className="text-lg font-semibold mb-2">User ID Match</h2>
            <p className="text-sm">
              {debugInfo.userIdMatch 
                ? '✅ Current user matches webhook user' 
                : '❌ Current user does NOT match webhook user'}
            </p>
          </div>

          {debugInfo.error && (
            <div className="bg-red-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2 text-red-800">Error</h2>
              <pre className="text-sm text-red-700">{JSON.stringify(debugInfo.error, null, 2)}</pre>
            </div>
          )}

          {debugInfo.userError && (
            <div className="bg-red-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2 text-red-800">User Error</h2>
              <p className="text-sm text-red-700">{debugInfo.userError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}