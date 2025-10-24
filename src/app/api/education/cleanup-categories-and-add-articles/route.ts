import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // First, let's clean up duplicate categories and merge them
    console.log('Starting category cleanup...');

    // Delete duplicate/empty categories and keep the ones with articles
    const categoriesToDelete = [
      'YhNjbBBz124QUoWAhJJU', // Fundamentals (empty)
      'h7emxMOXscKnsEqh3bX7', // Cocktail Recipes (duplicate)
      'FSSgV3c7zsBSJQRytmgU', // Equipment (empty, duplicate of Bar Equipment)
      'M8E2saGxEjtRLgebNxOU', // Techniques (empty, duplicate of Mixology Techniques)
      '5yiO8xe4Y2ror61HcMKK', // Ingredients (empty, duplicate of Cocktail Ingredients)
      'RLRBiKDF8xgvxQ6wXGFk', // Classics (empty, duplicate of Classic Cocktails)
      'MdB7IpuZTSNL10m8eCsa', // Trends (empty, duplicate of Cocktail Trends)
      'xsHHqB1Ou1AfntXapzXS'  // Cocktail Trends (empty)
    ];

    for (const categoryId of categoriesToDelete) {
      try {
        await adminDb.collection('education_categories').doc(categoryId).delete();
        console.log(`Deleted category: ${categoryId}`);
      } catch (error) {
        console.log(`Category ${categoryId} might not exist:`, error);
      }
    }

    // Now let's add articles to the remaining categories that need content
    const articlesToAdd = [
      // Articles for Bar Equipment category
      {
        title: "Essential Bar Tools Every Home Bartender Needs",
        slug: "essential-bar-tools-home-bartender-needs",
        excerpt: "Discover the must-have bar tools for creating professional cocktails at home, from shakers to jiggers and everything in between.",
        category: "bar-equipment",
        difficulty: "beginner",
        readingTime: 8,
        tags: ["bar tools", "home bar", "equipment", "bartending essentials", "cocktail tools"],
        content: `# Essential Bar Tools Every Home Bartender Needs

Building a home bar doesn't require a massive investment, but having the right tools makes all the difference. Here are the essential bar tools every aspiring mixologist should own.

## 1. Cocktail Shaker

The cocktail shaker is the heart of any bar setup. There are three main types:

- **Boston Shaker**: Two-piece design with a mixing glass and tin
- **Cobbler Shaker**: Three-piece design with built-in strainer
- **French Shaker**: Two-piece design with a mixing glass and smaller tin

**Recommendation**: Start with a Boston shaker for versatility and professional results.

## 2. Jigger

Precision is key in cocktail making. A jigger ensures consistent measurements:

- **Double-sided jigger**: Most common, with 1oz/2oz or 1.5oz/2oz measurements
- **Japanese-style jigger**: More precise with multiple measurements
- **Measuring cup**: For larger batches

## 3. Bar Spoon

Essential for stirred drinks and layering cocktails:

- **Long-handled spoon**: Reaches the bottom of mixing glasses
- **Twisted handle**: Helps with stirring technique
- **Flat end**: Perfect for muddling herbs

## 4. Strainer

Keeps ice and solids out of your finished drink:

- **Hawthorne strainer**: Most versatile, fits most shakers
- **Fine mesh strainer**: For removing small particles
- **Julep strainer**: For stirred drinks in mixing glasses

## 5. Muddler

Releases essential oils and flavors from herbs and fruits:

- **Wooden muddler**: Traditional choice, gentle on ingredients
- **Stainless steel muddler**: More durable, easier to clean
- **Flat bottom**: Better for muddling herbs

## 6. Citrus Juicer

Fresh juice is crucial for quality cocktails:

- **Hand juicer**: Simple and effective for small batches
- **Electric juicer**: For larger quantities
- **Reamer**: Manual citrus juicer with ridges

## Building Your Collection

Start with these six essential tools, then gradually add:
- Ice tongs
- Bottle opener
- Wine key
- Cutting board and knife
- Microplane grater

Remember, quality tools last longer and perform better. Invest in good equipment from the start for the best cocktail-making experience.`,
        featuredImage: 'https://images.unsplash.com/photo-1551024739-337eeb4d9b0e?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Discover the must-have bar tools for creating professional cocktails at home, from shakers to jiggers and everything in between.',
          keywords: ['bar tools', 'home bar', 'equipment', 'bartending essentials', 'cocktail tools']
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0
        }
      },

      // Articles for Home Bar Setup category
      {
        title: "Building a Budget-Friendly Home Bar: Essential Starter Kit",
        slug: "budget-friendly-home-bar-starter-kit",
        excerpt: "Create an impressive home bar without breaking the bank. Learn how to build a complete cocktail setup for under $200.",
        category: "home-bar-setup",
        difficulty: "beginner",
        readingTime: 12,
        tags: ["home bar", "budget", "starter kit", "cocktail setup", "beginner"],
        content: `# Building a Budget-Friendly Home Bar: Essential Starter Kit

You don't need to spend a fortune to create an impressive home bar. Here's how to build a complete cocktail setup for under $200.

## Essential Spirits ($80-100)

Start with these versatile base spirits:

### 1. Vodka ($15-20)
- **Brand**: Tito's, Smirnoff, or Absolut
- **Uses**: Moscow Mule, Vodka Tonic, Bloody Mary

### 2. Gin ($15-20)
- **Brand**: Beefeater, Bombay Sapphire, or Tanqueray
- **Uses**: Gin and Tonic, Martini, Negroni

### 3. Whiskey ($20-25)
- **Brand**: Buffalo Trace, Maker's Mark, or Jameson
- **Uses**: Old Fashioned, Whiskey Sour, Manhattan

### 4. Rum ($15-20)
- **Brand**: Bacardi, Captain Morgan, or Appleton Estate
- **Uses**: Mojito, Daiquiri, Rum and Coke

## Essential Mixers ($20-30)

### 1. Tonic Water ($3-5)
- **Brand**: Fever-Tree or Schweppes
- **Uses**: Gin and Tonic, Vodka Tonic

### 2. Club Soda ($2-3)
- **Brand**: Any brand works
- **Uses**: Highballs, spritzers

### 3. Orange Juice ($3-4)
- **Brand**: Fresh squeezed or Simply Orange
- **Uses**: Screwdriver, Tequila Sunrise

### 4. Cranberry Juice ($3-4)
- **Brand**: Ocean Spray
- **Uses**: Cosmopolitan, Cape Cod

### 5. Simple Syrup ($2-3)
- **Make your own**: Equal parts sugar and water
- **Uses**: Sweetening cocktails

## Essential Tools ($30-40)

### 1. Cocktail Shaker ($10-15)
- **Type**: Boston shaker (most versatile)
- **Brand**: OXO or Barfly

### 2. Jigger ($5-8)
- **Type**: Double-sided with 1oz/2oz measurements
- **Brand**: Any reliable brand

### 3. Bar Spoon ($5-8)
- **Type**: Long-handled with twisted stem
- **Brand**: Barfly or OXO

### 4. Strainer ($5-8)
- **Type**: Hawthorne strainer
- **Brand**: Barfly or OXO

### 5. Muddler ($5-8)
- **Type**: Wooden with flat bottom
- **Brand**: Any reliable brand

## Essential Glassware ($40-50)

### 1. Highball Glasses ($15-20)
- **Quantity**: 4 glasses
- **Uses**: Tall drinks with ice

### 2. Lowball Glasses ($15-20)
- **Quantity**: 4 glasses
- **Uses**: Short drinks over ice

### 3. Wine Glasses ($10-15)
- **Quantity**: 4 glasses
- **Uses**: Wine-based cocktails

## Storage and Organization

### 1. Bar Cart or Cabinet ($20-40)
- **Options**: IKEA cart, thrift store find, or repurpose furniture
- **Benefits**: Keeps everything organized and accessible

### 2. Ice Trays ($5-10)
- **Type**: Large cube trays for better dilution control
- **Brand**: Any brand works

## Budget-Friendly Tips

1. **Buy in bulk**: Larger bottles often cost less per ounce
2. **Shop sales**: Watch for discounts on spirits and mixers
3. **Make your own**: Simple syrup, grenadine, and bitters are easy to make
4. **Repurpose containers**: Use mason jars for storage and mixing
5. **Buy gradually**: Start with essentials, add more over time

## Starter Cocktail Recipes

With this setup, you can make:
- Gin and Tonic
- Vodka Tonic
- Whiskey Sour
- Rum and Coke
- Moscow Mule
- Old Fashioned
- Martini
- Margarita

## Total Investment: $170-220

This budget-friendly setup gives you everything you need to make professional-quality cocktails at home. Start with these essentials and gradually expand your collection as your skills and preferences develop.`,
        featuredImage: 'https://images.unsplash.com/photo-1551024739-337eeb4d9b0e?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Create an impressive home bar without breaking the bank. Learn how to build a complete cocktail setup for under $200.',
          keywords: ['home bar', 'budget', 'starter kit', 'cocktail setup', 'beginner']
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
      message: `Category cleanup completed and ${results.filter(r => r.status === 'success').length} articles added successfully`,
      deletedCategories: categoriesToDelete.length,
      addedArticles: results.filter(r => r.status === 'success').length,
      results
    });

  } catch (error) {
    console.error('Error in cleanup and article addition:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup categories and add articles',
      details: error.message
    }, { status: 500 });
  }
}
