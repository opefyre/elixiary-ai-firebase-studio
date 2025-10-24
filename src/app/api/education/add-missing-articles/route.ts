import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    // Articles to add for each category that needs more content
    const articlesToAdd = [
      // Bar Equipment articles (need 2 more)
      {
        title: "Essential Bar Tools Every Home Bartender Needs",
        slug: "essential-bar-tools-home-bartender",
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
      {
        title: "Glassware Guide: Choosing the Right Glass for Every Cocktail",
        slug: "glassware-guide-choosing-right-glass",
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

      // Home Bar Setup articles (need 3 more)
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
      },
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
      },
      {
        title: "Home Bar Design: Creating a Stylish and Functional Space",
        slug: "home-bar-design-stylish-functional-space",
        excerpt: "Transform your home bar into a stunning focal point with professional design tips, lighting ideas, and space optimization strategies.",
        category: "home-bar-setup",
        difficulty: "intermediate",
        readingTime: 11,
        tags: ["home bar", "design", "interior design", "styling", "cocktail space"],
        content: `# Home Bar Design: Creating a Stylish and Functional Space

A well-designed home bar combines functionality with aesthetic appeal, creating a space that's both practical and visually stunning. Here's how to design a bar that impresses guests and enhances your cocktail-making experience.

## 1. Design Styles

### Modern Minimalist
- **Characteristics**: Clean lines, neutral colors, minimal clutter
- **Colors**: White, gray, black with accent colors
- **Materials**: Glass, metal, wood
- **Best for**: Contemporary homes, small spaces

### Industrial Chic
- **Characteristics**: Exposed materials, raw textures, metal accents
- **Colors**: Gray, black, brown with metallic accents
- **Materials**: Steel, wood, concrete, brick
- **Best for**: Lofts, converted spaces, urban homes

### Classic Traditional
- **Characteristics**: Rich woods, ornate details, timeless appeal
- **Colors**: Deep browns, gold, cream
- **Materials**: Mahogany, brass, leather
- **Best for**: Traditional homes, formal entertaining

### Rustic Farmhouse
- **Characteristics**: Natural materials, weathered finishes, cozy feel
- **Colors**: Browns, creams, natural wood tones
- **Materials**: Reclaimed wood, stone, metal
- **Best for**: Country homes, casual entertaining

## 2. Space Planning

### Bar Layout Options

#### L-Shaped Bar
- **Benefits**: Maximizes corner space, creates defined areas
- **Best for**: Medium to large spaces
- **Features**: Prep area, mixing station, service area

#### Straight Bar
- **Benefits**: Simple, efficient, easy to build
- **Best for**: Narrow spaces, against walls
- **Features**: Linear workflow, easy access

#### Island Bar
- **Benefits**: Central location, 360-degree access
- **Best for**: Open floor plans, large spaces
- **Features**: Social interaction, flexible use

### Workflow Zones

#### Prep Zone
- **Location**: Near sink and refrigerator
- **Features**: Cutting board, knife, muddler
- **Storage**: Fresh ingredients, garnishes

#### Mixing Zone
- **Location**: Central, accessible area
- **Features**: Shaker, jigger, strainer
- **Storage**: Spirits, mixers, tools

#### Service Zone
- **Location**: Near guests, easy access
- **Features**: Glassware, garnishes, coasters
- **Storage**: Finished drinks, serving accessories

## 3. Lighting Design

### Task Lighting
- **Purpose**: Illuminate work areas
- **Types**: Under-cabinet lights, pendant lights
- **Placement**: Over mixing station, prep area
- **Brightness**: 3000-4000K color temperature

### Ambient Lighting
- **Purpose**: Create atmosphere
- **Types**: Recessed lights, wall sconces
- **Placement**: Throughout the space
- **Brightness**: Dimmer-controlled, warm tones

### Accent Lighting
- **Purpose**: Highlight features
- **Types**: LED strips, spotlights
- **Placement**: Behind bottles, under shelves
- **Colors**: Warm white or colored options

## 4. Storage Solutions

### Open Shelving
- **Benefits**: Easy access, visual appeal
- **Best for**: Frequently used items
- **Considerations**: Dust, organization

### Closed Cabinets
- **Benefits**: Protection, clean look
- **Best for**: Backup supplies, less-used items
- **Features**: Adjustable shelves, lighting

### Drawer Storage
- **Benefits**: Hidden storage, organization
- **Best for**: Tools, small items
- **Features**: Dividers, soft-close mechanisms

### Wall-Mounted Storage
- **Benefits**: Space-saving, accessible
- **Best for**: Tools, glassware
- **Types**: Hooks, racks, magnetic strips

## 5. Color Schemes

### Monochromatic
- **Colors**: Various shades of one color
- **Benefits**: Cohesive, sophisticated
- **Best for**: Small spaces, minimalist style

### Complementary
- **Colors**: Opposite colors on color wheel
- **Benefits**: High contrast, dynamic
- **Example**: Blue and orange, red and green

### Analogous
- **Colors**: Adjacent colors on color wheel
- **Benefits**: Harmonious, calming
- **Example**: Blue, green, teal

### Neutral with Accents
- **Colors**: Grays, whites, browns with pops of color
- **Benefits**: Timeless, flexible
- **Accent colors**: Gold, copper, deep blue

## 6. Materials and Finishes

### Countertops
- **Granite**: Durable, heat-resistant, elegant
- **Quartz**: Low maintenance, consistent color
- **Wood**: Warm, traditional, requires maintenance
- **Stainless Steel**: Modern, easy to clean

### Backsplash
- **Glass**: Easy to clean, modern look
- **Tile**: Versatile, many options
- **Metal**: Industrial feel, reflective
- **Stone**: Natural, durable

### Hardware
- **Brass**: Warm, traditional, develops patina
- **Stainless Steel**: Modern, easy to clean
- **Black**: Contemporary, dramatic
- **Copper**: Warm, unique, develops patina

## 7. Decorative Elements

### Artwork
- **Cocktail prints**: Vintage advertisements, modern art
- **Mirrors**: Expand space, reflect light
- **Photography**: Personal photos, travel memories
- **Sculptures**: Glass art, metal work

### Plants
- **Herbs**: Fresh mint, basil, rosemary
- **Succulents**: Low maintenance, modern
- **Air plants**: Unique, easy care
- **Fresh flowers**: Seasonal, colorful

### Accessories
- **Coasters**: Protect surfaces, add style
- **Cocktail napkins**: Functional, decorative
- **Bar mats**: Protect surfaces, add texture
- **Ice buckets**: Functional, stylish

## 8. Budget Considerations

### High-End Options
- **Custom cabinetry**: $5,000-15,000
- **Premium appliances**: $2,000-5,000
- **High-end finishes**: $3,000-8,000

### Mid-Range Options
- **Semi-custom cabinets**: $2,000-5,000
- **Standard appliances**: $500-2,000
- **Standard finishes**: $1,000-3,000

### Budget-Friendly Options
- **Stock cabinets**: $500-2,000
- **Basic appliances**: $200-500
- **DIY finishes**: $200-1,000

## 9. Maintenance and Care

### Daily Care
- **Wipe surfaces**: Keep everything clean
- **Check supplies**: Ensure adequate stock
- **Organize**: Keep tools in place

### Weekly Care
- **Deep clean**: Clean all surfaces and tools
- **Check equipment**: Ensure everything works
- **Restock**: Replace empty items

### Monthly Care
- **Polish surfaces**: Maintain finishes
- **Check instrumentation**: Ensure accuracy
- **Update decor**: Refresh seasonal elements

A well-designed home bar enhances your entertaining experience and adds value to your home. Take time to plan your design, consider your needs and budget, and create a space that reflects your personal style while maintaining functionality.`,
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
          metaDescription: 'Transform your home bar into a stunning focal point with professional design tips, lighting ideas, and space optimization strategies.',
          keywords: ['home bar', 'design', 'interior design', 'styling', 'cocktail space']
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0
        }
      },

      // Classic Cocktails articles (need 3 more)
      {
        title: "The Martini: History, Variations, and Perfect Technique",
        slug: "martini-history-variations-perfect-technique",
        excerpt: "Explore the rich history of the Martini, learn about its many variations, and master the technique for making the perfect Martini.",
        category: "classic-cocktails",
        difficulty: "intermediate",
        readingTime: 15,
        tags: ["martini", "classic cocktails", "gin cocktails", "cocktail history", "mixology techniques"],
        content: `# The Martini: History, Variations, and Perfect Technique

The Martini is perhaps the most iconic cocktail in the world, representing sophistication, elegance, and the art of mixology. Let's explore its rich history, numerous variations, and the technique for making the perfect Martini.

## A Brief History

### Origins
The Martini's exact origins are shrouded in mystery, with several competing theories:

- **Martinez Theory**: Named after the town of Martinez, California, where it was allegedly created
- **Martini & Rossi Theory**: Named after the Italian vermouth company
- **Martini & Henry Theory**: Named after a rifle used during the Civil War

### Evolution
The Martini has evolved significantly over time:

- **1860s**: Sweet vermouth and gin with orange bitters
- **1900s**: Dry vermouth and gin with olive garnish
- **1950s**: Very dry with minimal vermouth
- **Today**: Endless variations with different spirits and garnishes

## The Classic Martini Recipe

### Ingredients
- 2.5 oz Gin (or Vodka)
- 0.5 oz Dry Vermouth
- 1 dash Orange Bitters
- Lemon twist or olive for garnish

### Technique
1. **Chill the glass**: Place a martini glass in the freezer
2. **Add ingredients**: Combine gin, vermouth, and bitters in mixing glass
3. **Add ice**: Fill with large ice cubes
4. **Stir**: Stir for 30-45 seconds until well-chilled
5. **Strain**: Double-strain into chilled glass
6. **Garnish**: Express lemon peel or add olive

## Martini Variations

### 1. Dry Martini
- **Ratio**: 3:1 gin to vermouth
- **Characteristics**: Less vermouth, drier taste
- **Best for**: Those who prefer less sweetness

### 2. Extra Dry Martini
- **Ratio**: 5:1 gin to vermouth
- **Characteristics**: Minimal vermouth, very dry
- **Best for**: Purists who want gin to dominate

### 3. Wet Martini
- **Ratio**: 1:1 gin to vermouth
- **Characteristics**: Equal parts, more vermouth flavor
- **Best for**: Those who enjoy vermouth's complexity

### 4. Perfect Martini
- **Ratio**: Equal parts sweet and dry vermouth
- **Characteristics**: Balanced sweetness and dryness
- **Best for**: Those who want complexity

### 5. Vodka Martini
- **Spirit**: Vodka instead of gin
- **Characteristics**: Cleaner, less botanical
- **Best for**: Those who prefer vodka's neutrality

### 6. Dirty Martini
- **Addition**: Olive brine
- **Characteristics**: Salty, savory flavor
- **Best for**: Those who enjoy savory cocktails

### 7. Gibson Martini
- **Garnish**: Cocktail onion instead of olive
- **Characteristics**: Subtle onion flavor
- **Best for**: Those who prefer onions to olives

## Perfect Technique

### Glass Preparation
1. **Freeze the glass**: Place in freezer for 15 minutes
2. **Chill the glass**: Fill with ice and water
3. **Strain and dry**: Remove ice, dry with towel

### Mixing Method
1. **Use large ice**: Prevents over-dilution
2. **Stir, don't shake**: Maintains clarity and texture
3. **Stir for 30-45 seconds**: Proper dilution and chilling
4. **Double strain**: Remove ice chips and impurities

### Garnish Techniques
1. **Lemon twist**: Express oils over drink, rim glass
2. **Olive**: Use high-quality olives, skewer properly
3. **Onion**: Use cocktail onions, not pearl onions

## Common Mistakes to Avoid

### 1. Shaking Instead of Stirring
- **Problem**: Creates air bubbles, cloudy appearance
- **Solution**: Always stir clear cocktails

### 2. Using Warm Glassware
- **Problem**: Warms the drink, affects taste
- **Solution**: Always chill glassware

### 3. Over-dilution
- **Problem**: Watery, weak drink
- **Solution**: Use large ice, stir properly

### 4. Wrong Vermouth Ratio
- **Problem**: Unbalanced flavor
- **Solution**: Adjust ratio to taste

### 5. Poor Quality Ingredients
- **Problem**: Inferior taste and experience
- **Solution**: Use premium spirits and vermouth

## Serving and Presentation

### Glassware
- **Martini glass**: Classic V-shaped glass
- **Coupe glass**: Alternative elegant option
- **Size**: 6-8 oz capacity

### Temperature
- **Serving**: Ice-cold, around 32°F
- **Storage**: Keep spirits and vermouth refrigerated
- **Ice**: Use large, clear ice cubes

### Presentation
- **Clarity**: Crystal clear appearance
- **Garnish**: Simple, elegant presentation
- **Coaster**: Protect surfaces from condensation

## Pairing and Occasions

### Food Pairings
- **Appetizers**: Oysters, caviar, smoked salmon
- **Main courses**: Seafood, light pasta dishes
- **Desserts**: Light, citrus-based desserts

### Occasions
- **Cocktail hour**: Pre-dinner drinks
- **Business meetings**: Professional settings
- **Special occasions**: Celebrations and milestones

## Tips for Success

1. **Quality ingredients**: Use premium gin and vermouth
2. **Proper technique**: Master the stirring method
3. **Consistent ratios**: Find your preferred ratio
4. **Temperature control**: Keep everything cold
5. **Practice**: Perfect your technique through repetition

The Martini is more than just a cocktail—it's a symbol of sophistication and the art of mixology. Master its technique, explore its variations, and you'll have a timeless classic that never goes out of style.`,
        featuredImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Explore the rich history of the Martini, learn about its many variations, and master the technique for making the perfect Martini.',
          keywords: ['martini', 'classic cocktails', 'gin cocktails', 'cocktail history', 'mixology techniques']
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0
        }
      },
      {
        title: "The Manhattan: A Timeless Classic with Rich History",
        slug: "manhattan-timeless-classic-rich-history",
        excerpt: "Discover the Manhattan cocktail's fascinating history, learn the perfect recipe, and explore its many variations and serving techniques.",
        category: "classic-cocktails",
        difficulty: "intermediate",
        readingTime: 12,
        tags: ["manhattan", "classic cocktails", "whiskey cocktails", "cocktail history", "bourbon"],
        content: `# The Manhattan: A Timeless Classic with Rich History

The Manhattan is one of the world's most beloved cocktails, combining whiskey, sweet vermouth, and bitters in perfect harmony. Let's explore its rich history, perfect recipe, and the techniques that make it truly exceptional.

## A Rich History

### Origins
The Manhattan's creation is steeped in legend and lore:

- **1870s**: Allegedly created at the Manhattan Club in New York
- **Lady Churchill**: Winston Churchill's mother may have inspired its creation
- **Prohibition Era**: Became a symbol of sophistication and rebellion
- **Modern Era**: Remains a cornerstone of classic cocktail culture

### Evolution
The Manhattan has evolved while maintaining its core identity:

- **Original**: Rye whiskey, sweet vermouth, Angostura bitters
- **Variations**: Bourbon, different vermouths, various bitters
- **Modern**: Endless interpretations with premium ingredients

## The Classic Manhattan Recipe

### Ingredients
- 2 oz Rye Whiskey (or Bourbon)
- 1 oz Sweet Vermouth
- 2 dashes Angostura Bitters
- Cherry for garnish

### Technique
1. **Chill the glass**: Place a coupe or martini glass in freezer
2. **Add ingredients**: Combine whiskey, vermouth, and bitters in mixing glass
3. **Add ice**: Fill with large ice cubes
4. **Stir**: Stir for 30-45 seconds until well-chilled
5. **Strain**: Double-strain into chilled glass
6. **Garnish**: Add a high-quality cherry

## Manhattan Variations

### 1. Perfect Manhattan
- **Vermouth**: Equal parts sweet and dry vermouth
- **Characteristics**: Balanced sweetness and dryness
- **Best for**: Those who want complexity

### 2. Dry Manhattan
- **Vermouth**: Dry vermouth instead of sweet
- **Characteristics**: Less sweet, more herbal
- **Best for**: Those who prefer drier cocktails

### 3. Bourbon Manhattan
- **Whiskey**: Bourbon instead of rye
- **Characteristics**: Sweeter, more caramel notes
- **Best for**: Those who prefer bourbon's sweetness

### 4. Rob Roy
- **Whiskey**: Scotch whisky instead of rye
- **Characteristics**: Smoky, peaty flavor
- **Best for**: Scotch lovers

### 5. Black Manhattan
- **Bitters**: Averna instead of Angostura
- **Characteristics**: Darker, more complex
- **Best for**: Those who enjoy amaro flavors

### 6. Reverse Manhattan
- **Ratio**: More vermouth than whiskey
- **Characteristics**: Lighter, more vermouth-forward
- **Best for**: Those who prefer lighter drinks

## Perfect Technique

### Glass Preparation
1. **Freeze the glass**: Place in freezer for 15 minutes
2. **Chill the glass**: Fill with ice and water
3. **Strain and dry**: Remove ice, dry with towel

### Mixing Method
1. **Use large ice**: Prevents over-dilution
2. **Stir, don't shake**: Maintains clarity and texture
3. **Stir for 30-45 seconds**: Proper dilution and chilling
4. **Double strain**: Remove ice chips and impurities

### Garnish Techniques
1. **Cherry**: Use high-quality maraschino or Luxardo cherries
2. **Lemon twist**: Express oils over drink
3. **Orange twist**: Alternative citrus option

## Common Mistakes to Avoid

### 1. Shaking Instead of Stirring
- **Problem**: Creates air bubbles, cloudy appearance
- **Solution**: Always stir clear cocktails

### 2. Using Warm Glassware
- **Problem**: Warms the drink, affects taste
- **Solution**: Always chill glassware

### 3. Over-dilution
- **Problem**: Watery, weak drink
- **Solution**: Use large ice, stir properly

### 4. Wrong Vermouth Ratio
- **Problem**: Unbalanced flavor
- **Solution**: Adjust ratio to taste

### 5. Poor Quality Ingredients
- **Problem**: Inferior taste and experience
- **Solution**: Use premium spirits and vermouth

## Serving and Presentation

### Glassware
- **Coupe glass**: Classic elegant option
- **Martini glass**: Alternative V-shaped glass
- **Size**: 6-8 oz capacity

### Temperature
- **Serving**: Ice-cold, around 32°F
- **Storage**: Keep spirits and vermouth refrigerated
- **Ice**: Use large, clear ice cubes

### Presentation
- **Clarity**: Crystal clear appearance
- **Garnish**: Simple, elegant presentation
- **Coaster**: Protect surfaces from condensation

## Pairing and Occasions

### Food Pairings
- **Appetizers**: Cheese, charcuterie, nuts
- **Main courses**: Steak, roasted meats, rich pasta
- **Desserts**: Chocolate, caramel-based desserts

### Occasions
- **Cocktail hour**: Pre-dinner drinks
- **Business meetings**: Professional settings
- **Special occasions**: Celebrations and milestones

## Tips for Success

1. **Quality ingredients**: Use premium whiskey and vermouth
2. **Proper technique**: Master the stirring method
3. **Consistent ratios**: Find your preferred ratio
4. **Temperature control**: Keep everything cold
5. **Practice**: Perfect your technique through repetition

The Manhattan is a timeless classic that represents the pinnacle of cocktail craftsmanship. Master its technique, explore its variations, and you'll have a drink that never goes out of style.`,
        featuredImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Discover the Manhattan cocktail\'s fascinating history, learn the perfect recipe, and explore its many variations and serving techniques.',
          keywords: ['manhattan', 'classic cocktails', 'whiskey cocktails', 'cocktail history', 'bourbon']
        },
        stats: {
          views: 0,
          likes: 0,
          shares: 0
        }
      },
      {
        title: "The Old Fashioned: Mastering the Original Cocktail",
        slug: "old-fashioned-mastering-original-cocktail",
        excerpt: "Learn the history and technique of the Old Fashioned, the original cocktail that started it all. Master the perfect recipe and explore modern variations.",
        category: "classic-cocktails",
        difficulty: "intermediate",
        readingTime: 14,
        tags: ["old fashioned", "classic cocktails", "whiskey cocktails", "original cocktail", "bourbon"],
        content: `# The Old Fashioned: Mastering the Original Cocktail

The Old Fashioned is more than just a cocktail—it's the original cocktail, the foundation upon which all others are built. Let's explore its rich history, perfect technique, and the variations that keep it relevant today.

## A Historic Foundation

### Origins
The Old Fashioned's history is deeply rooted in cocktail culture:

- **1800s**: Originally called "whiskey cocktail" or "bittered sling"
- **1880s**: First reference to "old fashioned" cocktail
- **Prohibition Era**: Became a symbol of tradition and quality
- **Modern Era**: Remains a benchmark of cocktail craftsmanship

### Evolution
The Old Fashioned has maintained its core identity while evolving:

- **Original**: Whiskey, sugar, bitters, water
- **Variations**: Different spirits, sweeteners, and garnishes
- **Modern**: Premium ingredients and refined techniques

## The Classic Old Fashioned Recipe

### Ingredients
- 2 oz Bourbon (or Rye Whiskey)
- 1 sugar cube (or 1 tsp simple syrup)
- 2 dashes Angostura Bitters
- Orange peel for garnish

### Technique
1. **Chill the glass**: Place a rocks glass in freezer
2. **Muddle sugar**: Add sugar cube and bitters to glass
3. **Muddle**: Crush sugar cube until dissolved
4. **Add whiskey**: Pour whiskey over muddled mixture
5. **Add ice**: Fill with large ice cube or cubes
6. **Stir**: Stir gently for 15-20 seconds
7. **Garnish**: Express orange peel and add to glass

## Old Fashioned Variations

### 1. Rye Old Fashioned
- **Whiskey**: Rye instead of bourbon
- **Characteristics**: Spicier, more herbal
- **Best for**: Those who prefer rye's complexity

### 2. Smoky Old Fashioned
- **Whiskey**: Smoky scotch or mezcal
- **Characteristics**: Smoky, peaty flavor
- **Best for**: Those who enjoy smoky spirits

### 3. Rum Old Fashioned
- **Spirit**: Aged rum instead of whiskey
- **Characteristics**: Sweet, tropical notes
- **Best for**: Those who prefer rum's sweetness

### 4. Tequila Old Fashioned
- **Spirit**: Reposado tequila
- **Characteristics**: Agave, vanilla notes
- **Best for**: Those who enjoy tequila's complexity

### 5. Brandy Old Fashioned
- **Spirit**: Cognac or brandy
- **Characteristics**: Rich, fruity notes
- **Best for**: Those who prefer brandy's richness

### 6. Mezcal Old Fashioned
- **Spirit**: Mezcal instead of whiskey
- **Characteristics**: Smoky, earthy flavor
- **Best for**: Those who enjoy mezcal's complexity

## Perfect Technique

### Glass Preparation
1. **Freeze the glass**: Place in freezer for 15 minutes
2. **Chill the glass**: Fill with ice and water
3. **Strain and dry**: Remove ice, dry with towel

### Muddling Method
1. **Use sugar cube**: Traditional approach
2. **Add bitters**: Saturate sugar with bitters
3. **Muddle gently**: Crush until dissolved
4. **Don't over-muddle**: Avoid bitter flavors

### Ice Selection
1. **Large ice cube**: Prevents over-dilution
2. **Clear ice**: Better appearance and slower melting
3. **Ice sphere**: Alternative large ice option
4. **Avoid small ice**: Prevents over-dilution

### Garnish Techniques
1. **Orange peel**: Express oils over drink
2. **Lemon peel**: Alternative citrus option
3. **Cherry**: Luxardo or maraschino cherry
4. **Combination**: Orange peel and cherry

## Common Mistakes to Avoid

### 1. Over-muddling
- **Problem**: Bitter, unpleasant flavors
- **Solution**: Muddle gently, just until sugar dissolves

### 2. Using Small Ice
- **Problem**: Over-dilution, weak drink
- **Solution**: Use large ice cubes or spheres

### 3. Wrong Sugar Type
- **Problem**: Inconsistent sweetness
- **Solution**: Use sugar cubes or simple syrup

### 4. Poor Quality Ingredients
- **Problem**: Inferior taste and experience
- **Solution**: Use premium spirits and bitters

### 5. Over-stirring
- **Problem**: Over-dilution, weak drink
- **Solution**: Stir gently for 15-20 seconds

## Serving and Presentation

### Glassware
- **Rocks glass**: Classic lowball glass
- **Size**: 8-10 oz capacity
- **Material**: Heavy glass for better feel

### Temperature
- **Serving**: Cold but not over-diluted
- **Storage**: Keep spirits at room temperature
- **Ice**: Use large, clear ice cubes

### Presentation
- **Clarity**: Clear appearance with proper dilution
- **Garnish**: Simple, elegant presentation
- **Coaster**: Protect surfaces from condensation

## Pairing and Occasions

### Food Pairings
- **Appetizers**: Cheese, charcuterie, nuts
- **Main courses**: Steak, roasted meats, rich dishes
- **Desserts**: Chocolate, caramel-based desserts

### Occasions
- **Cocktail hour**: Pre-dinner drinks
- **Business meetings**: Professional settings
- **Special occasions**: Celebrations and milestones

## Tips for Success

1. **Quality ingredients**: Use premium whiskey and bitters
2. **Proper technique**: Master the muddling method
3. **Consistent ratios**: Find your preferred ratio
4. **Temperature control**: Use proper ice
5. **Practice**: Perfect your technique through repetition

The Old Fashioned is the foundation of cocktail culture, a timeless classic that represents the essence of mixology. Master its technique, explore its variations, and you'll have a drink that never goes out of style.`,
        featuredImage: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
        author: {
          name: 'Elixiary Team',
          bio: 'Professional mixologists and cocktail experts dedicated to sharing knowledge and techniques.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        publishedAt: new Date(),
        updatedAt: new Date(),
        status: 'published',
        seo: {
          metaDescription: 'Learn the history and technique of the Old Fashioned, the original cocktail that started it all. Master the perfect recipe and explore modern variations.',
          keywords: ['old fashioned', 'classic cocktails', 'whiskey cocktails', 'original cocktail', 'bourbon']
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
        
        const { adminDb } = initializeFirebaseServer();
        const docRef = await adminDb.collection('education_articles').add(articleData);
        results.push({
          id: docRef.id,
          title: article.title,
          category: article.category,
          status: 'success'
        });
      } catch (error) {
        results.push({
          title: article.title,
          category: article.category,
          status: 'error',
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Added ${results.filter(r => r.status === 'success').length} articles successfully`,
      results
    });

  } catch (error) {
    console.error('Error adding articles:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add articles',
      details: error.message
    }, { status: 500 });
  }
}
