import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasCredentials = !!process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
    
    // Try to parse the credentials
    let credentialsParsed = false;
    let projectId = null;
    
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      try {
        const parsed = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
        credentialsParsed = true;
        projectId = parsed.project_id;
      } catch (error) {
        console.error('Failed to parse credentials:', error);
      }
    }

    return NextResponse.json({
      message: 'Firebase Debug Info',
      environment: process.env.NODE_ENV,
      hasCredentials,
      hasProjectId,
      hasClientEmail,
      hasPrivateKey,
      credentialsParsed,
      projectId,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in debug API:', error);
    return NextResponse.json(
      { error: error.message || 'Debug API failed' },
      { status: 500 }
    );
  }
}
