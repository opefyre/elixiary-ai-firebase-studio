import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Add articles to categories that need more content
    const articlesToAdd = [
      // More articles for Bar Equipment category
      {
        title: "Glassware Guide: Choosing the Right Glass for Every Cocktail",
        slug: "glassware-guide-choosing-right-glass-cocktail",
        excerpt: "Learn about different types of cocktail glassware and how to choose the perfect glass for each type of drink.",
        category: "bar-equipment",
        difficulty: "beginner",
        readingTime: 10,
        tags: ["glassware", "cocktail glasses", "bar equipment", "presentation", "drink serving"],
        content: `# Glassware Guide: Choosing the Right Glass for Every Cocktail

The right glassware enhances both the visual appeal and drinking experience of cocktails. Here's your complete guide to cocktail glassware.

## 1. Coupe Glass

**Perfect for**: Champagne cocktails, sours, and stirred drinks
- **Shape**: Wide, shallow bowl with a stem
- **Benefits**: Elegant presentation, allows aromas to develop
- **Popular drinks**: French 75, Sidecar, Aviation

## 2. Martini Glass

**Perfect for**: Martinis, cosmopolitans, and other clear cocktails
- **Shape**: Wide, V-shaped bowl with a long stem
- **Benefits**: Shows off the cocktail's clarity and color
- **Popular drinks**: Martini, Cosmopolitan, Gibson

## 3. Highball Glass

**Perfect for**: Tall drinks with lots of ice and mixers
- **Shape**: Tall, straight-sided glass
- **Benefits**: Plenty of room for ice and garnishes
- **Popular drinks**: Gin and Tonic, Moscow Mule, Mojito

## 4. Lowball Glass (Rocks Glass)

**Perfect for**: Short drinks served over ice
- **Shape**: Short, wide glass with thick base
- **Benefits**: Sturdy, perfect for muddled drinks
- **Popular drinks**: Old Fashioned, Whiskey Sour, Margarita

## 5. Wine Glass

**Perfect for**: Wine-based cocktails and spritzes
- **Shape**: Tall stem with a bowl that tapers at the top
- **Benefits**: Enhances wine aromas and flavors
- **Popular drinks**: Sangria, Spritz, Wine cocktails

## 6. Champagne Flute

**Perfect for**: Champagne cocktails and sparkling drinks
- **Shape**: Tall, narrow glass with a stem
- **Benefits**: Preserves bubbles and carbonation
- **Popular drinks**: Mimosa, Bellini, Champagne cocktails

## 7. Shot Glass

**Perfect for**: Shots, layered drinks, and measuring
- **Shape**: Small, straight-sided glass
- **Benefits**: Precise measurements, perfect for shots
- **Popular drinks**: Tequila shots, layered shots

## Glassware Care Tips

1. **Hand wash only**: Avoid dishwashers to prevent clouding
2. **Use warm water**: Hot water can crack glasses
3. **Dry immediately**: Prevent water spots and streaks
4. **Store properly**: Use glass racks to prevent chipping

## Building Your Collection

Start with these essential glasses:
- 4 Highball glasses
- 4 Lowball glasses
- 4 Coupe glasses
- 2 Martini glasses
- 4 Wine glasses

Quality glassware elevates your cocktail experience and impresses your guests. Choose glasses that feel good in your hand and enhance the drinks you love most.`,
        featuredImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Learn about different types of cocktail glassware and how to choose the perfect glass for each type of drink.',
          keywords: ['glassware', 'cocktail glasses', 'bar equipment', 'presentation', 'drink serving']
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0
        }
      },

      // More articles for Home Bar Setup category
      {
        title: "Home Bar Organization: Tips for a Functional Setup",
        slug: "home-bar-organization-functional-setup",
        excerpt: "Learn how to organize your home bar for maximum efficiency and visual appeal. Tips for storage, workflow, and maintaining a clean workspace.",
        category: "home-bar-setup",
        difficulty: "beginner",
        readingTime: 9,
        tags: ["home bar", "organization", "storage", "workflow", "cocktail setup"],
        content: `# Home Bar Organization: Tips for a Functional Setup

A well-organized home bar makes cocktail creation more enjoyable and efficient. Here's how to set up a functional and visually appealing bar space.

## 1. Choose Your Location

### Kitchen Counter
- **Pros**: Easy access to water, ice, and cleanup
- **Cons**: Limited space, can get cluttered
- **Best for**: Small apartments, occasional use

### Dedicated Bar Cart
- **Pros**: Portable, stylish, dedicated space
- **Cons**: Limited storage, needs to be moved for use
- **Best for**: Small spaces, decorative appeal

### Built-in Bar Cabinet
- **Pros**: Maximum storage, professional look
- **Cons**: Requires more space and investment
- **Best for**: Dedicated entertaining spaces

## 2. Organize by Frequency of Use

### Front and Center (Most Used)
- **Spirits**: Vodka, gin, whiskey, rum
- **Mixers**: Tonic, soda, juices
- **Tools**: Shaker, jigger, spoon

### Middle Shelf (Regular Use)
- **Liqueurs**: Triple sec, vermouth, bitters
- **Garnishes**: Citrus, herbs, olives
- **Glassware**: Most common glasses

### Back/High Shelf (Occasional Use)
- **Specialty spirits**: Tequila, brandy, liqueurs
- **Seasonal ingredients**: Holiday mixers, special garnishes
- **Extra glassware**: Specialty glasses, backup sets

## 3. Storage Solutions

### Spirits Storage
- **Group by type**: All whiskeys together, all gins together
- **Label forward**: Make it easy to identify bottles
- **Use risers**: Create levels for better visibility
- **Keep backups**: Store extra bottles in a separate location

### Tool Organization
- **Hanging storage**: Use hooks or magnetic strips
- **Tool caddy**: Portable container for frequently used tools
- **Drawer dividers**: Keep small tools organized
- **Wall-mounted**: Install hooks or shelves for tools

### Glassware Storage
- **By type**: Group similar glasses together
- **Upside down**: Prevent dust accumulation
- **Use dividers**: Prevent glasses from touching
- **Keep extras**: Store backup glasses elsewhere

## 4. Workflow Optimization

### The Golden Triangle
Create an efficient workflow with three zones:

1. **Prep Zone**: Where you prepare ingredients
2. **Mixing Zone**: Where you build and shake drinks
3. **Service Zone**: Where you garnish and serve drinks

### Tool Placement
- **Shaker**: Always within arm's reach
- **Jigger**: Next to the shaker
- **Strainer**: With the shaker
- **Spoon**: Easy access for stirring
- **Muddler**: Near prep ingredients

## 5. Maintenance and Cleanup

### Daily Tasks
- **Wipe down surfaces**: Keep everything clean
- **Rinse tools**: Clean immediately after use
- **Check ice**: Ensure you have enough ice
- **Restock**: Replace empty bottles and mixers

### Weekly Tasks
- **Deep clean**: Clean all tools and surfaces
- **Check expiration**: Replace expired mixers
- **Organize**: Straighten up and reorganize
- **Inventory**: Check what needs restocking

### Monthly Tasks
- **Deep clean glassware**: Hand wash all glasses
- **Check equipment**: Ensure tools are in good condition
- **Update inventory**: Track what you've used
- **Plan purchases**: Make shopping lists

## 6. Visual Appeal

### Lighting
- **Task lighting**: Bright light over mixing area
- **Ambient lighting**: Soft light for atmosphere
- **Accent lighting**: Highlight special bottles

### Display
- **Color coordination**: Group bottles by color
- **Height variation**: Create visual interest
- **Symmetry**: Balance the arrangement
- **Personal touches**: Add photos, coasters, or art

## 7. Space-Saving Tips

### Vertical Storage
- **Use risers**: Create multiple levels
- **Hang tools**: Free up counter space
- **Stack glasses**: Use glass racks
- **Wall-mounted**: Install shelves and hooks

### Multi-Purpose Items
- **Tool combinations**: Use multi-purpose tools
- **Storage containers**: Repurpose for organization
- **Furniture**: Use existing furniture creatively

## 8. Inventory Management

### Keep Track
- **Shopping list**: Maintain a running list
- **Usage tracking**: Note what you use most
- **Expiration dates**: Track mixer expiration
- **Backup supplies**: Keep extras of essentials

### Smart Shopping
- **Buy in bulk**: Save money on frequently used items
- **Watch sales**: Stock up on discounted items
- **Plan ahead**: Buy seasonal items early
- **Quality over quantity**: Invest in good tools

A well-organized home bar enhances your cocktail-making experience and impresses your guests. Take time to set it up properly, and you'll enjoy years of great drinks and entertaining.`,
        featuredImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Learn how to organize your home bar for maximum efficiency and visual appeal. Tips for storage, workflow, and maintaining a clean workspace.',
          keywords: ['home bar', 'organization', 'storage', 'workflow', 'cocktail setup']
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0
        }
      }
    ];

    // Add articles to the database
    const results = [];
    for (const article of articlesToAdd) {
      try {
        const articleData = {
          ...article,
          author: {
            name: "Elixiary Team",
            bio: "Expert mixologists and cocktail enthusiasts dedicated to helping you create amazing drinks at home.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          },
          publishedAt: new Date(),
          updatedAt: new Date(),
          status: "published",
          stats: {
            views: 0,
            likes: 0,
            shares: 0
          }
        };
        
        const docRef = await adminDb.collection('education_articles').add(articleData);
        results.push({
          id: docRef.id,
          title: article.title,
          category: article.category,
          status: 'success'
        });
        console.log(`Added article: ${article.title}`);
      } catch (error) {
        results.push({
          title: article.title,
          category: article.category,
          status: 'error',
          error: error.message
        });
        console.error(`Error adding article ${article.title}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added ${results.filter(r => r.status === 'success').length} final articles successfully`,
      results
    });

  } catch (error) {
    console.error('Error adding final articles:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add final articles',
      details: error.message
    }, { status: 500 });
  }
}
