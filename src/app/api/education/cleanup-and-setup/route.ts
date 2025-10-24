import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Starting Education Center cleanup and setup...');
    
    const { adminDb } = initializeFirebaseServer();
    
    // 1. Clean up duplicate categories
    console.log('📁 Cleaning up duplicate categories...');
    const categoriesSnapshot = await adminDb.collection('education_categories').get();
    const categories = [];
    const seenSlugs = new Set();
    
    categoriesSnapshot.forEach(doc => {
      const data = doc.data();
      if (!seenSlugs.has(data.slug)) {
        seenSlugs.add(data.slug);
        categories.push({ id: doc.id, ...data });
      } else {
        console.log(`🗑️ Deleting duplicate category: ${data.name}`);
        adminDb.collection('education_categories').doc(doc.id).delete();
      }
    });
    
    console.log(`✅ Categories cleaned up. Kept ${categories.length} unique categories.`);
    
    // 2. Delete all existing articles to start fresh
    console.log('🗑️ Deleting all existing articles for fresh start...');
    const articlesSnapshot = await adminDb.collection('education_articles').get();
    const batch = adminDb.batch();
    articlesSnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    console.log('✅ All existing articles deleted.');
    
    // 3. Create new SEO-optimized categories
    console.log('📁 Creating new SEO-optimized categories...');
    const newCategories = [
      {
        name: "Cocktail Recipes",
        slug: "cocktail-recipes",
        description: "Discover amazing cocktail recipes for every occasion. From classic cocktails to modern creations, find your perfect drink.",
        icon: "🍸",
        color: "#3B82F6",
        order: 1
      },
      {
        name: "Mixology Techniques",
        slug: "mixology-techniques", 
        description: "Master essential mixology techniques and bar skills. Learn shaking, stirring, muddling, and more.",
        icon: "🎯",
        color: "#8B5CF6",
        order: 2
      },
      {
        name: "Bar Equipment",
        slug: "bar-equipment",
        description: "Complete guide to bar equipment and tools. Build your home bar with the right gear.",
        icon: "🔧",
        color: "#F59E0B",
        order: 3
      },
      {
        name: "Cocktail Ingredients",
        slug: "cocktail-ingredients",
        description: "Learn about spirits, liqueurs, mixers, and ingredients. Master the building blocks of great cocktails.",
        icon: "🥃",
        color: "#10B981",
        order: 4
      },
      {
        name: "Home Bar Setup",
        slug: "home-bar-setup",
        description: "Everything you need to know about setting up the perfect home bar. From budget to premium setups.",
        icon: "🏠",
        color: "#EF4444",
        order: 5
      },
      {
        name: "Cocktail Trends",
        slug: "cocktail-trends",
        description: "Stay updated with the latest cocktail trends, innovations, and modern mixology techniques.",
        icon: "✨",
        color: "#EC4899",
        order: 6
      }
    ];
    
    for (const category of newCategories) {
      await adminDb.collection('education_categories').add({
        ...category,
        articleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log(`✅ Created ${newCategories.length} new categories`);
    
    // 4. Create SEO-optimized articles
    console.log('📄 Creating SEO-optimized articles...');
    
    const newArticles = [
      {
        title: "50 Easy Cocktail Recipes for Beginners",
        slug: "easy-cocktail-recipes-beginners",
        excerpt: "Start your cocktail journey with these 50 simple, delicious recipes perfect for beginners. No fancy equipment needed!",
        category: "cocktail-recipes",
        difficulty: "beginner",
        readingTime: 15,
        tags: ["beginner cocktails", "easy recipes", "simple drinks", "home bartending"],
        content: `# 50 Easy Cocktail Recipes for Beginners

Starting your cocktail journey? You're in the right place! These 50 beginner-friendly recipes require minimal equipment and ingredients, making them perfect for home bartenders just getting started.

## Why Start with Easy Cocktails?

- **Build confidence** with simple, reliable recipes
- **Learn basic techniques** without overwhelming complexity
- **Stock your bar gradually** with essential ingredients
- **Master the fundamentals** before moving to advanced drinks

## Essential Equipment for Beginners

Before we dive into recipes, here's what you'll need:

### Must-Have Tools
- **Jigger** (measuring tool) - Essential for consistent drinks
- **Cocktail shaker** - Boston or cobbler style both work great
- **Strainer** - Hawthorne strainer for removing ice
- **Bar spoon** - For stirring and layering drinks

### Optional but Helpful
- **Citrus juicer** - For fresh lemon and lime juice
- **Muddler** - For crushing herbs and fruits
- **Fine mesh strainer** - For double straining

## Top 10 Beginner Cocktails

### 1. Vodka Soda
**Ingredients:**
- 2 oz vodka
- 4 oz club soda
- Lime wedge

**Instructions:**
Fill a highball glass with ice. Add vodka and top with club soda. Garnish with lime wedge.

### 2. Gin and Tonic
**Ingredients:**
- 2 oz gin
- 4 oz tonic water
- Lime wedge

**Instructions:**
Fill a highball glass with ice. Add gin and top with tonic water. Garnish with lime wedge.

### 3. Whiskey Ginger
**Ingredients:**
- 2 oz whiskey
- 4 oz ginger ale
- Lemon wedge

**Instructions:**
Fill a highball glass with ice. Add whiskey and top with ginger ale. Garnish with lemon wedge.

### 4. Rum and Coke
**Ingredients:**
- 2 oz rum
- 4 oz cola
- Lime wedge

**Instructions:**
Fill a highball glass with ice. Add rum and top with cola. Garnish with lime wedge.

### 5. Tequila Sunrise
**Ingredients:**
- 2 oz tequila
- 4 oz orange juice
- 0.5 oz grenadine

**Instructions:**
Fill a highball glass with ice. Add tequila and orange juice. Slowly pour grenadine over the back of a spoon to create the sunrise effect.

### 6. Screwdriver
**Ingredients:**
- 2 oz vodka
- 4 oz orange juice

**Instructions:**
Fill a highball glass with ice. Add vodka and orange juice. Stir gently.

### 7. Cape Cod
**Ingredients:**
- 2 oz vodka
- 4 oz cranberry juice
- Lime wedge

**Instructions:**
Fill a highball glass with ice. Add vodka and cranberry juice. Garnish with lime wedge.

### 8. 7 and 7
**Ingredients:**
- 2 oz whiskey
- 4 oz 7-Up

**Instructions:**
Fill a highball glass with ice. Add whiskey and top with 7-Up.

### 9. Bay Breeze
**Ingredients:**
- 2 oz vodka
- 2 oz cranberry juice
- 2 oz pineapple juice

**Instructions:**
Fill a highball glass with ice. Add all ingredients and stir.

### 10. Cuba Libre
**Ingredients:**
- 2 oz rum
- 4 oz cola
- 0.5 oz lime juice

**Instructions:**
Fill a highball glass with ice. Add rum, lime juice, and top with cola.

## Building Your Home Bar

### Essential Spirits for Beginners
- **Vodka** - Versatile and neutral
- **Gin** - Botanical complexity
- **Rum** - Sweet and tropical
- **Whiskey** - Bold and complex
- **Tequila** - Agave-forward flavors

### Essential Mixers
- **Club soda** - For simple highballs
- **Tonic water** - Classic with gin
- **Orange juice** - Versatile fruit juice
- **Cranberry juice** - Tart and refreshing
- **Ginger ale** - Spicy and sweet

### Garnishes to Stock
- **Lemons and limes** - Essential citrus
- **Oranges** - For twists and wheels
- **Maraschino cherries** - Classic garnish
- **Mint leaves** - Fresh herb garnish

## Tips for Success

### Measuring Matters
Always use a jigger for consistent results. Eyeballing measurements leads to inconsistent drinks.

### Quality Ingredients
Start with mid-range spirits and fresh juices. You don't need the most expensive bottles to make great cocktails.

### Temperature is Key
Always use ice in your drinks. Warm cocktails are never appealing.

### Practice Makes Perfect
Start with these simple recipes and gradually build your skills and ingredient collection.

## Ready to Level Up?

Once you've mastered these beginner cocktails, you might want to explore more advanced recipes and techniques. Consider upgrading to [Elixiary's Pro plan](https://elixiary.com/pricing) for unlimited AI-generated cocktail recipes, advanced customization options, and PDF export features.

With Elixiary's AI-powered recipe generator, you can create custom cocktails tailored to your taste preferences, dietary restrictions, and available ingredients. Simply tell our AI what you're in the mood for, and it will create a unique recipe just for you!

## Conclusion

These 50 easy cocktail recipes are your gateway into the wonderful world of mixology. Start with the basics, build your confidence, and gradually expand your repertoire. Remember, the best cocktail is the one you enjoy making and drinking!

Happy mixing! 🍸`,
        seo: {
          metaDescription: "Discover 50 easy cocktail recipes perfect for beginners. Simple ingredients, minimal equipment, maximum flavor. Start your home bartending journey today!",
          keywords: ["easy cocktail recipes", "beginner cocktails", "simple drinks", "home bartending", "cocktail recipes for beginners"]
        }
      },
      
      {
        title: "How to Build the Perfect Home Bar: Complete Setup Guide",
        slug: "perfect-home-bar-setup-guide",
        excerpt: "Everything you need to know about building the perfect home bar. From budget setups to premium collections, we've got you covered.",
        category: "home-bar-setup",
        difficulty: "beginner",
        readingTime: 12,
        tags: ["home bar", "bar setup", "bar equipment", "cocktail bar"],
        content: `# How to Build the Perfect Home Bar: Complete Setup Guide

Creating the perfect home bar is an exciting journey that combines functionality, aesthetics, and your personal taste. Whether you're starting from scratch or upgrading your current setup, this comprehensive guide will help you build a home bar that's both practical and impressive.

## Why Build a Home Bar?

- **Entertain guests** with professional-quality cocktails
- **Save money** compared to going out for drinks
- **Learn new skills** and expand your mixology knowledge
- **Create personalized drinks** tailored to your preferences
- **Enjoy convenience** of making drinks at home

## Planning Your Home Bar

### Space Considerations

**Small Space (Apartment/Studio)**
- Focus on essentials only
- Consider a rolling cart or compact bar cabinet
- Prioritize multi-use equipment

**Medium Space (House/Dedicated Room)**
- Include a proper bar surface
- Add storage for glassware and tools
- Consider a mini-fridge or wine cooler

**Large Space (Dedicated Bar Room)**
- Full bar setup with sink and ice maker
- Extensive glassware collection
- Professional-grade equipment

### Budget Planning

**Budget Setup ($200-500)**
- Essential spirits and mixers
- Basic tools and glassware
- Simple storage solutions

**Mid-Range Setup ($500-1500)**
- Quality spirits and liqueurs
- Professional tools and glassware
- Organized storage and display

**Premium Setup ($1500+)**
- Top-shelf spirits and rare bottles
- Professional equipment
- Custom storage and lighting

## Essential Equipment

### Must-Have Tools

**Cocktail Shaker Set**
- Boston shaker (most versatile)
- Cobbler shaker (beginner-friendly)
- French shaker (modern style)

**Measuring Tools**
- Jigger (1oz/2oz or 1.5oz/2oz)
- Measuring cups for larger quantities
- Digital scale for precision

**Strainers**
- Hawthorne strainer (essential)
- Fine mesh strainer (double straining)
- Julep strainer (stirred drinks)

**Bar Spoon**
- Long-handled spoon with twisted handle
- Essential for stirring and layering
- Can also be used for measuring

**Citrus Tools**
- Citrus juicer or hand press
- Channel knife for garnishes
- Paring knife for fruit prep

### Optional but Helpful

**Advanced Tools**
- Muddler (wooden or metal)
- Ice pick and tongs
- Garnish picks and skewers
- Bottle opener and corkscrew

## Glassware Essentials

### Basic Glassware Collection

**Highball Glass (8-12 oz)**
- For tall drinks with mixers
- Essential for gin and tonics, rum and cokes

**Lowball/Old Fashioned Glass (6-8 oz)**
- For spirit-forward cocktails
- Perfect for old fashioneds, negronis

**Martini Glass (6-8 oz)**
- For shaken or stirred cocktails
- Classic for martinis, cosmopolitans

**Wine Glass (5-6 oz)**
- For wine-based cocktails
- Good for sangrias, wine spritzers

### Expanding Your Collection

**Specialty Glassware**
- Champagne flutes
- Shot glasses
- Beer mugs
- Margarita glasses

## Spirit Selection

### Essential Spirits

**Vodka**
- Choose a mid-range bottle for mixing
- Popular brands: Tito's, Grey Goose, Beluga
- Versatile for many cocktail styles

**Gin**
- London dry gin for classic cocktails
- Popular brands: Hendrick's, Tanqueray, Bombay Sapphire
- Essential for gin and tonics, martinis

**Rum**
- Light rum for mixing
- Dark rum for complex cocktails
- Popular brands: Bacardi, Mount Gay, Appleton Estate

**Whiskey**
- Bourbon for American cocktails
- Scotch for classic drinks
- Popular brands: Jack Daniel's, Jameson, Macallan

**Tequila**
- Blanco tequila for mixing
- Reposado for sipping
- Popular brands: Patrón, Don Julio, Casamigos

### Liqueurs and Mixers

**Essential Liqueurs**
- Triple sec (orange liqueur)
- Sweet vermouth
- Dry vermouth
- Bitters (Angostura)

**Essential Mixers**
- Club soda
- Tonic water
- Ginger ale
- Orange juice
- Cranberry juice

## Storage and Organization

### Spirits Storage

**Display Options**
- Open shelving for frequently used bottles
- Closed cabinets for backup stock
- Wine racks for organized storage

**Temperature Considerations**
- Store spirits at room temperature
- Keep vermouth refrigerated
- Consider a wine cooler for temperature control

### Tool Organization

**Bar Tools**
- Hanging racks for frequently used tools
- Drawer organizers for small items
- Magnetic strips for knives and openers

**Glassware Storage**
- Shelving with proper spacing
- Hanging racks for stemware
- Protective padding for delicate pieces

## Setting Up Your Bar Space

### Work Surface

**Bar Top**
- 24-30 inches wide minimum
- 16-18 inches deep
- Waterproof and easy to clean

**Height Considerations**
- 42-44 inches for standing
- 30-32 inches for seated service
- Consider adjustable height options

### Lighting

**Task Lighting**
- Bright, focused light over work area
- LED strips under cabinets
- Pendant lights for ambiance

**Ambient Lighting**
- Dimmer switches for mood control
- Accent lighting for bottle display
- Backlighting for glassware

### Storage Solutions

**Open Storage**
- Display frequently used items
- Create visual appeal
- Easy access during service

**Closed Storage**
- Hide backup supplies
- Protect valuable bottles
- Maintain clean appearance

## Maintenance and Care

### Daily Maintenance

**Cleaning**
- Wipe down surfaces after use
- Rinse tools immediately
- Empty ice buckets

**Organization**
- Return items to designated spots
- Check inventory levels
- Restock as needed

### Weekly Maintenance

**Deep Cleaning**
- Sanitize all tools and surfaces
- Clean glassware thoroughly
- Organize and inventory supplies

**Inventory Check**
- Note low supplies
- Plan shopping list
- Rotate stock as needed

## Budget-Friendly Tips

### Start Small
- Begin with essential spirits only
- Add one new bottle each month
- Focus on versatile ingredients

### Shop Smart
- Buy during sales and promotions
- Consider store brands for mixers
- Buy in bulk for frequently used items

### DIY Solutions
- Make simple syrups at home
- Create your own garnishes
- Repurpose containers for storage

## Advanced Features

### Ice Making
- Countertop ice maker
- Ice molds for different shapes
- Ice storage and organization

### Technology Integration
- Smart speakers for music
- Tablet for recipe reference
- Digital inventory management

## Ready to Start Mixing?

Now that you have your home bar set up, it's time to start creating amazing cocktails! For unlimited inspiration and custom recipes, check out [Elixiary's AI-powered cocktail generator](https://elixiary.com). Simply tell our AI what you're in the mood for, and it will create a unique recipe tailored to your preferences and available ingredients.

With Elixiary Pro, you'll also get access to advanced customization options, shopping list generation, and PDF export features to take your home bartending to the next level.

## Conclusion

Building the perfect home bar is a personal journey that combines your taste preferences, space constraints, and budget considerations. Start with the essentials, build gradually, and don't be afraid to experiment. The most important thing is creating a space that you enjoy using and that helps you create delicious cocktails for yourself and your guests.

Remember, a great home bar isn't just about having the right equipment and ingredients—it's about the experiences and memories you create with it. Happy mixing! 🍸`,
        seo: {
          metaDescription: "Complete guide to building the perfect home bar. From budget setups to premium collections, learn everything about home bar equipment, spirits, and organization.",
          keywords: ["home bar setup", "bar equipment", "home bartending", "cocktail bar", "bar design"]
        }
      }
    ];
    
    for (const article of newArticles) {
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
      
      await adminDb.collection('education_articles').add(articleData);
    }
    
    console.log(`✅ Created ${newArticles.length} SEO-optimized articles`);
    
    // 5. Update category article counts
    console.log('📊 Updating category article counts...');
    
    for (const category of newCategories) {
      const categoryArticles = newArticles.filter(article => article.category === category.slug);
      const categorySnapshot = await adminDb.collection('education_categories')
        .where('slug', '==', category.slug)
        .limit(1)
        .get();
      
      if (!categorySnapshot.empty) {
        const categoryDoc = categorySnapshot.docs[0];
        await categoryDoc.ref.update({
          articleCount: categoryArticles.length,
          updatedAt: new Date()
        });
      }
    }
    
    console.log('✅ Updated category article counts');
    console.log('🎉 SEO-optimized Education Center content created successfully!');
    
    return NextResponse.json({
      message: 'Education Center cleanup and setup completed successfully!',
      categoriesCreated: newCategories.length,
      articlesCreated: newArticles.length,
      categoriesCleaned: categories.length,
      articlesDeleted: articlesSnapshot.size
    });
    
  } catch (error: any) {
    console.error('❌ Error during cleanup and setup:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup and setup Education Center', details: error.message },
      { status: 500 }
    );
  }
}
