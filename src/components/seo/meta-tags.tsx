interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  nofollow?: boolean;
}

export function MetaTags({
  title,
  description,
  keywords,
  canonical,
  ogImage = '/opengraph-image.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
}: MetaTagsProps) {
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title || 'Elixiary AI'} />
      <meta property="og:description" content={description || 'AI-Powered Cocktail Recipe Generator'} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical || 'https://ai.elixiary.com'} />
      <meta property="og:site_name" content="Elixiary AI" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title || 'Elixiary AI'} />
      <meta name="twitter:description" content={description || 'AI-Powered Cocktail Recipe Generator'} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@elixiary_ai" />
      
      {/* Robots */}
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`} />
      
      {/* Additional SEO */}
      <meta name="author" content="Elixiary AI" />
      <meta name="generator" content="Next.js" />
      <meta name="theme-color" content="#8b5cf6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Elixiary AI" />
      <meta name="mobile-web-app-capable" content="yes" />
    </>
  );
}
