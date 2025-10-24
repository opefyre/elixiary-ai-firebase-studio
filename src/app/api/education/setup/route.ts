import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Sample categories data
    const categories = [
      {
        name: 'Fundamentals',
        slug: 'fundamentals',
        description: 'Master the basics of mixology, from understanding spirits to building your first cocktails.',
        icon: '📚',
        color: '#3B82F6',
        order: 1,
        articleCount: 0,
      },
      {
        name: 'Equipment',
        slug: 'equipment',
        description: 'Learn about essential bar tools, glassware, and equipment every mixologist needs.',
        icon: '🔧',
        color: '#8B5CF6',
        order: 2,
        articleCount: 0,
      },
      {
        name: 'Techniques',
        slug: 'techniques',
        description: 'Advanced mixing techniques, garnishing, and presentation skills for professional results.',
        icon: '🎯',
        color: '#F59E0B',
        order: 3,
        articleCount: 0,
      },
      {
        name: 'Ingredients',
        slug: 'ingredients',
        description: 'Deep dive into spirits, liqueurs, bitters, and how to use them effectively in cocktails.',
        icon: '🥃',
        color: '#10B981',
        order: 4,
        articleCount: 0,
      },
      {
        name: 'Classics',
        slug: 'classics',
        description: 'Timeless cocktail recipes that every mixologist should know and master.',
        icon: '🍸',
        color: '#EF4444',
        order: 5,
        articleCount: 0,
      },
      {
        name: 'Trends',
        slug: 'trends',
        description: 'Modern mixology trends, innovative techniques, and contemporary cocktail culture.',
        icon: '✨',
        color: '#EC4899',
        order: 6,
        articleCount: 0,
      },
    ];

    // Sample articles data
    const articles = [
      {
        title: 'The Art of Shaking: Mastering the Shake Technique',
        slug: 'art-of-shaking-mastering-shake-technique',
        excerpt: 'Learn the fundamental shaking techniques that every mixologist needs to master for perfect cocktails.',
        content: `# The Art of Shaking: Mastering the Shake Technique

Shaking is one of the most fundamental techniques in mixology, and mastering it can elevate your cocktails from good to exceptional. In this comprehensive guide, we'll explore everything you need to know about the shake technique.

## Why Shake?

Shaking serves several important purposes in cocktail making:

- **Chilling**: Rapidly cools the drink to the optimal temperature
- **Dilution**: Adds the right amount of water to balance flavors
- **Aeration**: Incorporates air for a lighter, more refreshing texture
- **Integration**: Thoroughly mixes all ingredients

## The Basic Shake Technique

### Step 1: Choose Your Shaker
The most common types of shakers are:
- **Boston Shaker**: Two-piece design with a glass and metal tin
- **Cobbler Shaker**: Three-piece design with built-in strainer
- **French Shaker**: Two-piece design with two metal tins

### Step 2: Add Ingredients
Always add ingredients in this order:
1. Ice (fill shaker 2/3 full)
2. Liquids (spirits, liqueurs, juices)
3. Sweeteners (simple syrup, honey, etc.)

### Step 3: The Shake
- Hold the shaker firmly with both hands
- Shake vigorously for 10-15 seconds
- Use a back-and-forth motion, not circular
- Listen for the ice breaking - this indicates proper aeration

### Step 4: Double Strain
- Use a Hawthorne strainer to remove ice chips
- Fine strain for drinks with muddled ingredients
- Serve immediately in a chilled glass

## Common Mistakes to Avoid

1. **Over-shaking**: Can over-dilute and make drinks watery
2. **Under-shaking**: Results in uneven temperature and poor integration
3. **Wrong ice size**: Use large, hard ice cubes for best results
4. **Warm ingredients**: Always use chilled ingredients when possible

## Practice Makes Perfect

The key to mastering the shake technique is practice. Start with simple cocktails like the Daiquiri or Whiskey Sour, and gradually work your way up to more complex drinks. Remember, a great shake is the foundation of a great cocktail.`,
        featuredImage: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&h=600&fit=crop',
        category: 'techniques',
        difficulty: 'beginner',
        readingTime: 8,
        tags: ['shaking', 'techniques', 'fundamentals', 'cocktail making'],
        author: {
          name: 'Master Mixologist',
          bio: 'Professional mixologist with 15+ years of experience in craft cocktails.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Master the fundamental shaking techniques for perfect cocktails. Learn proper form, timing, and common mistakes to avoid.',
          keywords: ['shaking techniques', 'cocktail making', 'mixology basics', 'bar techniques'],
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0,
        },
      },
      {
        title: 'Essential Bar Tools: Building Your Mixology Toolkit',
        slug: 'essential-bar-tools-building-mixology-toolkit',
        excerpt: 'Discover the must-have tools every aspiring mixologist needs to create professional-quality cocktails at home.',
        content: `# Essential Bar Tools: Building Your Mixology Toolkit

Building a proper bar toolkit is essential for any aspiring mixologist. Whether you're setting up a home bar or working in a professional environment, having the right tools can make all the difference in your cocktail-making experience.

## The Core Essentials

### 1. Shaker Set
- **Boston Shaker**: Most versatile and professional choice
- **Cobbler Shaker**: Great for beginners with built-in strainer
- **French Shaker**: Sleek design, popular in modern bars

### 2. Strainers
- **Hawthorne Strainer**: Essential for removing ice and large particles
- **Fine Mesh Strainer**: For double-straining and removing small particles
- **Julep Strainer**: For stirred drinks and juleps

### 3. Mixing Glass
- **Glass Mixing Bowl**: For stirred cocktails
- **Metal Mixing Tin**: Alternative to glass, keeps drinks colder longer

### 4. Bar Spoon
- **Long-handled Spoon**: For stirring and layering drinks
- **Twisted Handle**: Helps with proper stirring technique

### 5. Jigger
- **Double-ended Jigger**: Most common, typically 1oz/2oz or 1.5oz/2oz
- **Measured Jigger**: Multiple measurements in one tool

## Advanced Tools

### 1. Muddler
- **Wooden Muddler**: Traditional choice, great for herbs and fruits
- **Metal Muddler**: More durable, easier to clean

### 2. Citrus Juicer
- **Hand Press**: For fresh citrus juice
- **Electric Juicer**: For larger batches

### 3. Ice Tools
- **Ice Pick**: For breaking large ice blocks
- **Ice Tongs**: For handling ice cubes
- **Ice Mold**: For creating large ice cubes

### 4. Garnish Tools
- **Channel Knife**: For citrus peels and garnishes
- **Paring Knife**: For fruit garnishes
- **Garnish Picks**: For skewering garnishes

## Building Your Collection

### Starter Kit (Essential)
- Boston Shaker set
- Hawthorne strainer
- Bar spoon
- Jigger
- Muddler

### Intermediate Kit (Add)
- Fine mesh strainer
- Mixing glass
- Citrus juicer
- Channel knife

### Professional Kit (Complete)
- All of the above
- Ice tools
- Multiple strainers
- Garnish tools
- Specialty items

## Care and Maintenance

- **Clean immediately**: Rinse tools after each use
- **Proper storage**: Store tools in a dry, organized manner
- **Regular maintenance**: Check for wear and replace as needed
- **Professional cleaning**: Use bar-specific cleaning products

## Quality vs. Price

While it's tempting to buy the cheapest tools available, investing in quality equipment will:
- Last longer and perform better
- Make cocktail making more enjoyable
- Produce more consistent results
- Save money in the long run

Remember, you don't need to buy everything at once. Start with the essentials and build your collection over time as your skills and interest grow.`,
        featuredImage: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
        category: 'equipment',
        difficulty: 'beginner',
        readingTime: 10,
        tags: ['bar tools', 'equipment', 'mixology toolkit', 'home bar'],
        author: {
          name: 'Bar Equipment Expert',
          bio: 'Specialist in bar equipment and mixology tools with extensive industry experience.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Build the perfect mixology toolkit with essential bar tools. Learn what equipment you need for professional-quality cocktails.',
          keywords: ['bar tools', 'mixology equipment', 'cocktail tools', 'home bar setup'],
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0,
        },
      },
      {
        title: 'Understanding Spirits: A Complete Guide to Base Liquors',
        slug: 'understanding-spirits-complete-guide-base-liquors',
        excerpt: 'Dive deep into the world of spirits and learn how different base liquors affect your cocktail creations.',
        content: `# Understanding Spirits: A Complete Guide to Base Liquors

Understanding spirits is fundamental to creating great cocktails. Each base liquor brings unique characteristics that can make or break a drink. Let's explore the major categories and how to use them effectively.

## The Six Base Spirits

### 1. Vodka
**Characteristics**: Neutral, clean, versatile
**Best for**: Cocktails where you want other flavors to shine
**Popular brands**: Grey Goose, Beluga, Tito's
**Classic cocktails**: Martini, Bloody Mary, Moscow Mule

### 2. Gin
**Characteristics**: Botanical, juniper-forward, complex
**Best for**: Cocktails that benefit from herbal complexity
**Popular brands**: Hendrick's, Tanqueray, Bombay Sapphire
**Classic cocktails**: Gin & Tonic, Negroni, Aviation

### 3. Rum
**Characteristics**: Sweet, tropical, varied by age
**Best for**: Tropical and tiki cocktails
**Popular brands**: Bacardi, Mount Gay, Appleton Estate
**Classic cocktails**: Mojito, Daiquiri, Mai Tai

### 4. Whiskey
**Characteristics**: Bold, complex, varies by region
**Best for**: Strong, spirit-forward cocktails
**Popular brands**: Jack Daniel's, Jameson, Macallan
**Classic cocktails**: Old Fashioned, Manhattan, Whiskey Sour

### 5. Tequila
**Characteristics**: Agave-forward, earthy, versatile
**Best for**: Fresh, citrusy cocktails
**Popular brands**: Patrón, Don Julio, Casamigos
**Classic cocktails**: Margarita, Paloma, Tequila Sunrise

### 6. Brandy
**Characteristics**: Fruity, smooth, aged complexity
**Best for**: After-dinner drinks and classic cocktails
**Popular brands**: Hennessy, Rémy Martin, Courvoisier
**Classic cocktails**: Sidecar, Brandy Alexander, French 75

## Understanding Quality Levels

### Well/Bar Rail
- Basic quality, mixed drinks
- Good for high-volume cocktails
- Lower price point

### Call/Premium
- Mid-range quality
- Better for sipping
- More complex flavors

### Top Shelf/Super Premium
- Highest quality
- Best for sipping neat
- Most expensive

## Mixing Guidelines

### Balancing Flavors
- **Sweet**: Use simple syrup, honey, or liqueurs
- **Sour**: Add citrus juice or vinegar
- **Bitter**: Include bitters or amaro
- **Strong**: Control alcohol content with mixers

### Temperature Considerations
- **Shaken drinks**: Use for drinks with citrus or egg whites
- **Stirred drinks**: Use for spirit-forward cocktails
- **Built drinks**: Layer ingredients in the glass

### Glassware Selection
- **Martini glass**: For shaken or stirred cocktails
- **Old Fashioned glass**: For spirit-forward drinks
- **Highball glass**: For long drinks with mixers

## Storage and Care

### Proper Storage
- Store in cool, dark places
- Keep bottles upright
- Avoid temperature fluctuations
- Use within 6 months of opening

### Quality Indicators
- Clear, consistent color
- Smooth texture
- Balanced flavor profile
- Appropriate alcohol content

## Building Your Collection

### Starter Collection
- Vodka (1 bottle)
- Gin (1 bottle)
- Rum (1 bottle)
- Whiskey (1 bottle)

### Intermediate Collection
- Add tequila and brandy
- Include different styles (e.g., aged rum, single malt whiskey)
- Add specialty liqueurs

### Advanced Collection
- Multiple expressions of each spirit
- Rare and limited editions
- International varieties
- Aged and vintage options

Remember, the key to great cocktails is understanding how different spirits work together and complement each other. Start with quality base spirits and build your knowledge from there.`,
        featuredImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        category: 'ingredients',
        difficulty: 'beginner',
        readingTime: 12,
        tags: ['spirits', 'base liquors', 'cocktail ingredients', 'alcohol guide'],
        author: {
          name: 'Spirits Sommelier',
          bio: 'Certified spirits expert with deep knowledge of global distilleries and production methods.',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Master the art of spirits with our comprehensive guide to base liquors. Learn how different spirits affect your cocktails.',
          keywords: ['spirits guide', 'base liquors', 'cocktail ingredients', 'alcohol types'],
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0,
        },
      },
    ];

    // Create categories
    console.log('Creating categories...');
    for (const category of categories) {
      await adminDb.collection('education_categories').add(category);
    }

    // Create articles
    console.log('Creating articles...');
    for (const article of articles) {
      await adminDb.collection('education_articles').add(article);
    }

    return NextResponse.json({
      message: 'Education Center data setup complete!',
      categoriesCreated: categories.length,
      articlesCreated: articles.length,
    });
  } catch (error: any) {
    console.error('Error setting up education data:', error);
    return NextResponse.json(
      { error: 'Failed to setup education data' },
      { status: 500 }
    );
  }
}
