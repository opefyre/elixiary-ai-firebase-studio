export type MockRecipe = {
  id: string;
  recipeName: string;
  publishedDate: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prepTime: string;
  tags: string[];
  category: "Classic" | "Modern" | "Tropical" | "Non-Alcoholic";
  mood: "Celebratory" | "Relaxing" | "Party" | "Sophisticated";
};

export const mockRecipes: MockRecipe[] = [
  {
    id: "1",
    recipeName: "Spiced Pear Collins",
    publishedDate: "Oct 26, 2023",
    difficulty: "Easy",
    prepTime: "5 min",
    tags: ["Gin", "Fruity", "Autumn"],
    category: "Modern",
    mood: "Relaxing",
  },
  {
    id: "2",
    recipeName: "Smoky Rosemary Old Fashioned",
    publishedDate: "Nov 15, 2023",
    difficulty: "Medium",
    prepTime: "8 min",
    tags: ["Whiskey", "Smoky", "Herbal"],
    category: "Classic",
    mood: "Sophisticated",
  },
  {
    id: "3",
    recipeName: "Passionfruit & Chili Margarita",
    publishedDate: "Jan 05, 2024",
    difficulty: "Easy",
    prepTime: "7 min",
    tags: ["Tequila", "Spicy", "Tropical"],
    category: "Tropical",
    mood: "Party",
  },
  {
    id: "4",
    recipeName: "The Midnight Bloom",
    publishedDate: "Feb 12, 2024",
    difficulty: "Hard",
    prepTime: "12 min",
    tags: ["Vodka", "Floral", "Elegant"],
    category: "Modern",
    mood: "Sophisticated",
  },
  {
    id: "5",
    recipeName: "Sunset Pineapple Mocktail",
    publishedDate: "Mar 20, 2024",
    difficulty: "Easy",
    prepTime: "5 min",
    tags: ["Juice", "Sweet", "Refreshing"],
    category: "Non-Alcoholic",
    mood: "Relaxing",
  },
  {
    id: "6",
    recipeName: "Jubilant Raspberry Fizz",
    publishedDate: "Jun 01, 2024",
    difficulty: "Medium",
    prepTime: "10 min",
    tags: ["Champagne", "Berry", "Bubbly"],
    category: "Classic",
    mood: "Celebratory",
  },
];
