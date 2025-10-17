import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://ai.elixiary.com';
  const now = new Date().toISOString();

  // Popular tags for filtering
  const popularTags = [
    'flavor_citrus',
    'style_contemporary_classic',
    'strength_moderate',
    'flavor_fruity',
    'style_classic',
    'serve_up',
    'serve_long',
    'season_summer',
    'occ_party',
    'flavor_sweet',
    'style_new_era',
    'diet_dairy',
    'texture_creamy',
    'occ_brunch',
    'serve_bubbly',
    'strength_strong',
    'serve_frozen',
    'flavor_coffee',
    'serve_on_rocks',
    'flavor_sour',
    'flavor_intense',
    'style_tiki',
    'style_sour_family',
    'style_shot',
    'style_spritz',
    'strength_low_abv',
    'flavor_savory',
    'flavor_bitter',
    'serve_hot',
    'flavor_spicy',
    'flavor_chocolate',
    'setting_beach',
    'season_winter',
    'diet_egg',
    'style_punch',
    'holiday_christmas',
    'season_autumn',
    'style_highball',
    'flavor_nutty',
    'diet_vegan',
  ];

  // Popular search terms
  const popularSearches = [
    'margarita',
    'mojito',
    'martini',
    'old fashioned',
    'cosmopolitan',
    'daiquiri',
    'whiskey sour',
    'gin and tonic',
    'bloody mary',
    'pina colada',
    'manhattan',
    'negroni',
    'moscow mule',
    'caipirinha',
    'sangria',
    'mimosa',
    'bellini',
    'aperol spritz',
    'paloma',
    'sidecar',
  ];

  // Difficulty levels
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${popularTags.map(tag => `  <url>
    <loc>${baseUrl}/cocktails?tag=${tag}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
  
  ${popularSearches.map(search => `  <url>
    <loc>${baseUrl}/cocktails?search=${encodeURIComponent(search)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
  
  ${difficulties.map(difficulty => `  <url>
    <loc>${baseUrl}/cocktails?difficulty=${encodeURIComponent(difficulty)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
