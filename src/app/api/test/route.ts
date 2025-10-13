import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test basic functionality
    return NextResponse.json({ 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });

  } catch (error: any) {
    console.error('Error in test API:', error);
    return NextResponse.json(
      { error: error.message || 'Test API failed' },
      { status: 500 }
    );
  }
}
