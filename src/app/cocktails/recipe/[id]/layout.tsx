import { Metadata } from 'next';
import { initializeFirebaseServer } from '@/firebase/server';

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
    const title = `${recipe.name} Recipe | Elixiary AI`;
    
    // Ensure title is under 60 characters for SEO
    const shortTitle = title.length > 60 ? `${recipe.name} | Elixiary AI` : title;
    
    return {
      title: shortTitle,
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
        title: shortTitle,
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
        title: shortTitle,
        description: `Learn how to make ${recipe.name} cocktail.`,
      },
      alternates: {
        canonical: `https://ai.elixiary.com/cocktails/recipe/${params.id}`,
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
