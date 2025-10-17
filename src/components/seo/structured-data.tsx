interface StructuredDataProps {
  type: 'WebApplication' | 'Recipe' | 'BreadcrumbList' | 'Organization';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
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
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
}

// Predefined structured data components
export function WebApplicationStructuredData() {
  return (
    <StructuredData
      type="WebApplication"
      data={{
        name: 'Elixiary AI',
        description: 'AI-Powered Cocktail Recipe Generator',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com',
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
          url: process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com',
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

export function RecipeStructuredData({ recipe }: { recipe: any }) {
  return (
    <StructuredData
      type="Recipe"
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

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <StructuredData
      type="BreadcrumbList"
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

export function OrganizationStructuredData() {
  return (
    <StructuredData
      type="Organization"
      data={{
        name: 'Elixiary AI',
        url: process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com',
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://ai.elixiary.com'}/icon.png`,
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
