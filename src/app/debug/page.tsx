'use client';

import { useFirebase, useUser } from '@/firebase';
import { useEffect, useState } from 'react';

export default function DebugPage() {
  const { firestore, auth } = useFirebase();
  const { user, isUserLoading, userError } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    async function runDebug() {
      if (!user || !firestore) return;

      try {
        // Get current user info
        const currentUserInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };

        // Try to read user document
        const userDoc = await firestore.collection('users').doc(user.uid).get();
        
        // Try to read the webhook user document
        const webhookUserDoc = await firestore.collection('users').doc('uzyFZtgGRAZZUlqc3j7c42PUHgk1').get();

        setDebugInfo({
          currentUser: currentUserInfo,
          currentUserDocument: {
            exists: userDoc.exists,
            data: userDoc.exists ? userDoc.data() : null,
          },
          webhookUserDocument: {
            exists: webhookUserDoc.exists,
            data: webhookUserDoc.exists ? webhookUserDoc.data() : null,
          },
          firebaseConfig: {
            projectId: firestore.app.options.projectId,
          },
        });
      } catch (error: any) {
        setDebugInfo({
          error: {
            message: error.message,
            code: error.code,
          },
        });
      }
    }

    runDebug();
  }, [user, firestore]);

  if (isUserLoading) {
    return <div>Loading debug info...</div>;
  }

  if (userError) {
    return <div>Auth Error: {userError.message}</div>;
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

          {debugInfo.error && (
            <div className="bg-red-100 p-4 rounded">
              <h2 className="text-lg font-semibold mb-2 text-red-800">Error</h2>
              <pre className="text-sm text-red-700">{JSON.stringify(debugInfo.error, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
