interface StructuredDataProps {
  type: 'WebApplication' | 'Recipe' | 'BreadcrumbList' | 'Organization';
  data: any;
  nonce?: string;
}

export function StructuredData({ type, data, nonce }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    };

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}

// Predefined structured data components
export function WebApplicationStructuredData({ nonce }: { nonce?: string }) {
  return (
    <StructuredData
      type="WebApplication"
      nonce={nonce}
      data={{
        name: 'Elixiary AI',
        description: 'AI-Powered Cocktail Recipe Generator',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com',
        applicationCategory: 'Food & Drink',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free tier available',
        },
        creator: {
          '@type': 'Organization',
          name: 'Elixiary AI',
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com',
        },
        featureList: [
          'AI Cocktail Recipe Generation',
          '500+ Curated Cocktail Recipes',
          'Save and Organize Recipes',
          'Shopping List Generation',
          'PDF Export',
          'Mobile Responsive Design',
        ],
      }}
    />
  );
}

export function RecipeStructuredData({ recipe, nonce }: { recipe: any; nonce?: string }) {
  return (
    <StructuredData
      type="Recipe"
      nonce={nonce}
      data={{
        name: recipe.name,
        description: `Learn how to make ${recipe.name} with this detailed cocktail recipe`,
        image: recipe.imageUrl,
        author: {
          '@type': 'Organization',
          name: 'Elixiary AI',
        },
        datePublished: recipe.createdAt,
        prepTime: recipe.prepTime,
        recipeCategory: 'Cocktail',
        recipeCuisine: 'International',
        recipeYield: '1 serving',
        recipeIngredient: recipe.ingredients?.map((ing: any) => `${ing.measure} ${ing.name}`) || [],
        recipeInstructions: recipe.instructions?.map((instruction: string, index: number) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text: instruction,
        })) || [],
        totalTime: recipe.prepTime,
        cookTime: recipe.prepTime,
        keywords: recipe.tags?.join(', ') || '',
        recipeServings: 1,
        nutrition: {
          '@type': 'NutritionInformation',
          calories: 'Varies',
        },
      }}
    />
  );
}

export function BreadcrumbStructuredData({ items, nonce }: { items: Array<{ name: string; url: string }>; nonce?: string }) {
  return (
    <StructuredData
      type="BreadcrumbList"
      nonce={nonce}
      data={{
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function OrganizationStructuredData({ nonce }: { nonce?: string }) {
  return (
    <StructuredData
      type="Organization"
      nonce={nonce}
      data={{
        name: 'Elixiary AI',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com',
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://elixiary.com'}/logo.png`,
        description: 'AI-Powered Cocktail Recipe Generator',
        sameAs: [
          'https://twitter.com/elixiary_ai',
          'https://github.com/elixiary-ai',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'hello@elixiary.com',
        },
      }}
    />
  );
}
