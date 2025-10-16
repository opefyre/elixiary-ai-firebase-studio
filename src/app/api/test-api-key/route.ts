import { NextRequest, NextResponse } from 'next/server';
import { APIKeyManager } from '@/lib/api-keys';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing API key validation...');
    const apiKeyManager = new APIKeyManager();
    
    const apiKey = 'elx_live_90cba0067a96f0e3d11d13e678c238be';
    const email = 'opefyre@gmail.com';
    
    console.log('Validating API key:', apiKey, 'for email:', email);
    
    const keyData = await apiKeyManager.validateAPIKey(apiKey, email);
    console.log('API key validation successful:', {
      id: keyData.id,
      userId: keyData.userId,
      email: keyData.email,
      status: keyData.status
    });
    
    return NextResponse.json({
      success: true,
      message: 'API key validation successful',
      keyData: {
        id: keyData.id,
        userId: keyData.userId,
        email: keyData.email,
        status: keyData.status
      }
    });
    
  } catch (error: any) {
    console.error('API key test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
