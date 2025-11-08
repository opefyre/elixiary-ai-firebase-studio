export interface CocktailCategoryLike {
  id: string;
  name?: string | null;
}

const formatFromSlug = (slug: string) => {
  return slug
    .replace(/^cat_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export function getCategoryDisplayName(
  category: CocktailCategoryLike | string | null | undefined
) {
  if (!category) {
    return '';
  }

  if (typeof category === 'string') {
    if (!category.trim()) {
      return '';
    }

    return formatFromSlug(category);
  }

  if (category.name) {
    return category.name;
  }

  return formatFromSlug(category.id);
}

export function getCategorySlug(
  category: CocktailCategoryLike | string | null | undefined
) {
  if (!category) {
    return '';
  }

  if (typeof category === 'string') {
    return category;
  }

  return category.id;
}
