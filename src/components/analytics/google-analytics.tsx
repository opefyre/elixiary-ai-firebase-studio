'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  nonce?: string;
}

export function GoogleAnalytics({ nonce }: GoogleAnalyticsProps) {
  const GA_MEASUREMENT_ID = 'G-SNBQ629KYP';

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        nonce={nonce}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

