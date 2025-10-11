'use client';

import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // Use the hooks directly
  let firebaseServices, userServices;
  try {
    firebaseServices = useFirebase();
    userServices = useUser();
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

        // Try to read user document (Firebase v9+ syntax)
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        // Try to read the webhook user document
        const webhookUserDocRef = doc(firestore, 'users', 'uzyFZtgGRAZZUlqc3j7c42PUHgk1');
        const webhookUserDoc = await getDoc(webhookUserDocRef);

        setDebugInfo({
          currentUser: currentUserInfo,
          currentUserDocument: {
            exists: userDoc.exists(),
            data: userDoc.exists() ? userDoc.data() : null,
          },
          webhookUserDocument: {
            exists: webhookUserDoc.exists(),
            data: webhookUserDoc.exists() ? webhookUserDoc.data() : null,
          },
          firebaseConfig: {
            projectId: firestore.app.options.projectId,
          },
          userIdMatch: user.uid === 'uzyFZtgGRAZZUlqc3j7c42PUHgk1',
        });
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
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Current User</h2>
            <pre className="text-sm">{JSON.stringify(debugInfo.currentUser, null, 2)}</pre>
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