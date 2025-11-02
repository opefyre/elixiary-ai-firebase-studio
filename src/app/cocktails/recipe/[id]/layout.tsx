import { Metadata } from 'next';
import { initializeFirebaseServer } from '@/firebase/server';
import { getCanonicalUrl } from '@/lib/config';

// Generate metadata for individual recipe pages
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { adminDb } = await initializeFirebaseServer();
    const recipeDoc = await adminDb.collection('curated-recipes').doc(params.id).get();
    
    if (!recipeDoc.exists) {
      return {
        title: 'Recipe Not Found | Elixiary AI',
        description: 'The requested cocktail recipe could not be found.',
      };
    }

    const recipe = recipeDoc.data()!;
    
    // Create concise, SEO-friendly title
    let title = `${recipe.name} | Elixiary AI`;
    
    // If still too long, just use recipe name with shorter suffix
    if (title.length > 50) {
      title = `${recipe.name} Cocktail | Elixiary AI`;
    }
    
    // Final fallback for very long recipe names
    if (title.length > 55) {
      title = `${recipe.name} | Elixiary AI`;
    }
    
    return {
      title: title,
      description: `Learn how to make ${recipe.name} cocktail. ${recipe.instructions || 'Professional recipe with ingredients and instructions.'}`,
      keywords: [
        recipe.name.toLowerCase(),
        'cocktail recipe',
        'mixology',
        recipe.glassware?.toLowerCase(),
        recipe.category?.replace('cat_', '').replace(/_/g, ' '),
        ...(recipe.tags || []).map((tag: string) => tag.toLowerCase()),
      ],
      openGraph: {
        title: title,
        description: `Learn how to make ${recipe.name} cocktail with our professional recipe.`,
        type: 'article',
        images: recipe.imageUrl ? [
          {
            url: recipe.imageUrl,
            width: 800,
            height: 600,
            alt: `${recipe.name} cocktail recipe`,
          },
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: `Learn how to make ${recipe.name} cocktail.`,
      },
      alternates: {
        canonical: getCanonicalUrl(`/cocktails/recipe/${params.id}`),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Cocktail Recipe | Elixiary AI',
      description: 'Professional cocktail recipe with ingredients and instructions.',
    };
  }
}

export default function RecipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
