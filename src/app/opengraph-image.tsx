import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Elixiary AI - AI-Powered Cocktail Recipe Generator';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '60px',
          }}
        >
          {/* Cocktail Glass Emoji */}
          <div
            style={{
              fontSize: '120px',
              marginBottom: '30px',
            }}
          >
            🍸
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Elixiary AI
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: '36px',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '40px',
              maxWidth: '900px',
            }}
          >
            AI-Powered Cocktail Recipe Generator
          </div>
          
          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              fontSize: '22px',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              ✨ AI Recipes
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              💾 Save & Share
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔓 Free Tier
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

