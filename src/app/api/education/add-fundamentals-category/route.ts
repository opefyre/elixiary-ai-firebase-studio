import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // First, create the Fundamentals category
    const categoryData = {
      name: "Mixology Fundamentals",
      slug: "mixology-fundamentals", 
      description: "Essential mixology concepts and techniques every home bartender should master. Learn the basics of cocktail creation, balance, and presentation.",
      icon: "🎓",
      color: "#3B82F6",
      order: 1,
      articleCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const categoryRef = await adminDb.collection('education_categories').add(categoryData);
    console.log('Created Fundamentals category:', categoryRef.id);

    // Now add 4 fundamental articles
    const articles = [
      {
        title: "Introduction to Mixology: The Art and Science of Cocktail Creation",
        slug: "introduction-mixology-art-science-cocktail-creation",
        excerpt: "Discover the fundamentals of mixology and learn how to create balanced, delicious cocktails. Master the basic principles that every home bartender should know.",
        content: `# Introduction to Mixology: The Art and Science of Cocktail Creation

Mixology is the art and science of creating cocktails, combining creativity with technical knowledge to craft balanced, flavorful drinks. Whether you're a complete beginner or looking to refine your skills, understanding these fundamental principles will elevate your cocktail-making abilities.

## What is Mixology?

Mixology goes beyond simply mixing ingredients together. It's about understanding how flavors interact, how to balance different taste elements, and how to create drinks that are both delicious and visually appealing. The term "mixology" comes from the word "mix," but it encompasses much more than simple mixing.

### The Art of Mixology
- **Creativity**: Developing new flavor combinations
- **Presentation**: Creating visually appealing drinks
- **Storytelling**: Each cocktail tells a story through its ingredients
- **Personal expression**: Reflecting your taste and style

### The Science of Mixology
- **Chemistry**: Understanding how ingredients interact
- **Physics**: How temperature, dilution, and aeration affect drinks
- **Biology**: How our taste buds perceive different flavors
- **Mathematics**: Precise measurements and ratios

## The Five Basic Taste Elements

Every well-balanced cocktail incorporates these five taste elements:

### 1. Sweet
- **Sources**: Simple syrup, honey, liqueurs, fruit juices
- **Purpose**: Cuts acidity and bitterness, provides balance
- **Examples**: Simple syrup in a Whiskey Sour, Cointreau in a Margarita

### 2. Sour
- **Sources**: Citrus juices (lemon, lime), vinegar, tart fruits
- **Purpose**: Adds brightness and cuts sweetness
- **Examples**: Lemon juice in a Tom Collins, lime juice in a Daiquiri

### 3. Bitter
- **Sources**: Bitters, amaro, certain spirits
- **Purpose**: Adds complexity and sophistication
- **Examples**: Angostura bitters in an Old Fashioned, Campari in a Negroni

### 4. Strong (Alcohol)
- **Sources**: Spirits, liqueurs, fortified wines
- **Purpose**: Provides the base flavor and alcohol content
- **Examples**: Gin in a Martini, whiskey in a Manhattan

### 5. Weak (Dilution)
- **Sources**: Water (from ice melt), club soda, tonic
- **Purpose**: Reduces alcohol intensity, integrates flavors
- **Examples**: Ice melt in a stirred cocktail, soda water in a highball

## The Golden Ratio

Many classic cocktails follow what's known as the "Golden Ratio" - a 2:1:1 proportion:
- **2 parts spirit**: The base alcohol
- **1 part sweet**: Sweetener or sweet liqueur
- **1 part sour**: Citrus juice or acid

### Examples of the Golden Ratio
- **Daiquiri**: 2 oz rum, 1 oz lime juice, 1 oz simple syrup
- **Whiskey Sour**: 2 oz whiskey, 1 oz lemon juice, 1 oz simple syrup
- **Sidecar**: 2 oz cognac, 1 oz orange liqueur, 1 oz lemon juice

## Essential Mixing Techniques

### Shaking
- **Use for**: Cocktails with citrus juice, egg whites, or cream
- **Purpose**: Rapid chilling and thorough mixing
- **Result**: Frothy, aerated texture

### Stirring
- **Use for**: Spirit-forward cocktails, drinks with vermouth
- **Purpose**: Gentle mixing and controlled dilution
- **Result**: Clear, silky texture

### Building
- **Use for**: Simple highballs, layered drinks
- **Purpose**: Quick preparation with minimal equipment
- **Result**: Light, refreshing drinks

### Muddling
- **Use for**: Releasing flavors from herbs, fruits, or spices
- **Purpose**: Extracting essential oils and juices
- **Result**: Fresh, aromatic cocktails

## Building Your Flavor Profile

### Understanding Flavor Categories
- **Citrus**: Bright, acidic, refreshing
- **Herbal**: Fresh, aromatic, complex
- **Spiced**: Warm, aromatic, comforting
- **Fruity**: Sweet, juicy, tropical
- **Smoky**: Rich, complex, sophisticated

### Flavor Pairing Principles
- **Complementary**: Similar flavors that enhance each other
- **Contrasting**: Opposite flavors that balance each other
- **Layered**: Multiple flavors that build complexity
- **Harmonious**: Flavors that work together naturally

## Essential Equipment for Beginners

### Must-Have Tools
- **Cocktail shaker**: For mixing and chilling drinks
- **Jigger**: For precise measurements
- **Bar spoon**: For stirring and layering
- **Strainer**: For removing ice and solids
- **Muddler**: For crushing herbs and fruits

### Basic Glassware
- **Highball glass**: For tall drinks with ice
- **Lowball glass**: For short drinks over ice
- **Martini glass**: For chilled cocktails
- **Shot glass**: For measuring and shots

## Quality Ingredients Matter

### Spirits
- **Choose quality over quantity**: Better spirits make better cocktails
- **Understand flavor profiles**: Each spirit has unique characteristics
- **Proper storage**: Keep spirits in cool, dark places

### Fresh Ingredients
- **Citrus juices**: Always use fresh-squeezed when possible
- **Herbs**: Use fresh herbs for best flavor and aroma
- **Ice**: Use filtered water for clean-tasting ice

## Common Beginner Mistakes

### Overcomplicating
- Start simple and build complexity gradually
- Master basic techniques before attempting advanced ones
- Focus on balance rather than complexity

### Poor Measurements
- Use a jigger for consistent results
- Follow recipes precisely when learning
- Understand how small changes affect the final drink

### Ignoring Balance
- Taste your drinks before serving
- Adjust sweetness, acidity, or strength as needed
- Remember that balance is subjective

## Developing Your Palate

### Taste Training
- **Practice regularly**: Make cocktails often to develop muscle memory
- **Taste everything**: Sample different spirits, liqueurs, and ingredients
- **Take notes**: Record what you like and dislike
- **Experiment**: Try new combinations and techniques

### Understanding Your Preferences
- **Sweet vs. Dry**: Do you prefer sweeter or drier drinks?
- **Strong vs. Light**: What alcohol level do you enjoy?
- **Simple vs. Complex**: Do you like straightforward or layered flavors?

## The Journey Ahead

Mixology is a lifelong learning process. Start with these fundamentals, practice regularly, and don't be afraid to experiment. Remember that the best cocktail is the one you enjoy most, and the best way to improve is through practice and experimentation.

### Next Steps
1. **Master the basics**: Perfect your shaking, stirring, and measuring techniques
2. **Build your collection**: Gradually acquire quality spirits and tools
3. **Experiment safely**: Try new combinations while understanding the principles
4. **Learn from others**: Study classic recipes and modern innovations
5. **Develop your style**: Find your own voice in cocktail creation

## Conclusion

Mixology is both an art and a science, requiring creativity, technical skill, and a deep understanding of how flavors work together. By mastering these fundamental principles, you'll be well on your way to creating exceptional cocktails that delight your guests and satisfy your own palate.

Remember that every expert was once a beginner. Start with these basics, practice regularly, and enjoy the journey of becoming a skilled mixologist.`,
        featuredImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
        category: "mixology-fundamentals",
        difficulty: "beginner",
        readingTime: 12,
        tags: ["mixology basics", "cocktail fundamentals", "beginner mixology", "cocktail creation", "mixology principles"],
        seo: {
          metaDescription: "Discover the fundamentals of mixology and learn how to create balanced, delicious cocktails. Master the basic principles that every home bartender should know.",
          keywords: ["mixology basics", "cocktail fundamentals", "beginner mixology", "cocktail creation", "mixology principles"]
        }
      },
      {
        title: "Understanding Cocktail Balance: The Science Behind Perfect Proportions",
        slug: "understanding-cocktail-balance-science-perfect-proportions",
        excerpt: "Learn the science behind perfectly balanced cocktails. Discover how to achieve the ideal ratio of sweet, sour, strong, and weak elements in every drink.",
        content: `# Understanding Cocktail Balance: The Science Behind Perfect Proportions

Creating a perfectly balanced cocktail is both an art and a science. Understanding the principles of balance will help you create consistently excellent drinks that please the palate and showcase the ingredients' best qualities.

## The Four Pillars of Balance

Every well-crafted cocktail rests on four fundamental pillars that work together to create harmony:

### 1. Sweet (Sugar)
Sweetness provides the foundation that supports other flavors and cuts through acidity and bitterness.

**Sources of Sweetness:**
- Simple syrup (1:1 sugar to water)
- Rich syrup (2:1 sugar to water)
- Honey syrup
- Agave nectar
- Liqueurs (Cointreau, Grand Marnier)
- Sweet vermouth
- Fruit juices

**Role in Balance:**
- Cuts acidity from citrus juices
- Softens harsh alcohol flavors
- Provides body and mouthfeel
- Enhances other flavors

### 2. Sour (Acid)
Acidity adds brightness, cuts sweetness, and provides the sharp contrast that makes cocktails refreshing and lively.

**Sources of Acidity:**
- Fresh citrus juices (lemon, lime, orange)
- Vinegar (in shrubs and gastriques)
- Tart fruit juices (cranberry, pomegranate)
- Wine-based acids
- Citric acid solutions

**Role in Balance:**
- Cuts through sweetness
- Adds brightness and freshness
- Enhances fruit flavors
- Provides refreshing quality

### 3. Strong (Alcohol)
The spirit provides the backbone of the cocktail, carrying flavors and providing the warming sensation that defines a cocktail.

**Sources of Strength:**
- Base spirits (gin, vodka, whiskey, rum, tequila)
- Fortified wines (vermouth, port, sherry)
- Liqueurs and amari
- High-proof spirits

**Role in Balance:**
- Provides the primary flavor profile
- Carries other ingredients
- Adds warmth and body
- Creates the cocktail's character

### 4. Weak (Dilution)
Water from ice melt, mixers, or other diluents reduces alcohol intensity and helps integrate all the flavors.

**Sources of Dilution:**
- Ice melt during shaking or stirring
- Club soda, tonic water
- Fresh juices with high water content
- Simple syrups
- Other mixers

**Role in Balance:**
- Reduces alcohol intensity
- Integrates all flavors
- Provides refreshing quality
- Makes the drink approachable

## The Golden Ratio: A Starting Point

While no single ratio works for every cocktail, many classic drinks follow variations of what's known as the "golden ratio" - typically 2:1:1 (spirit:sweet:sour). This foundation has proven successful across countless recipes.

### Variations of the Golden Ratio

**Classic 2:1:1 Ratio**
- 2 parts spirit
- 1 part sweet
- 1 part sour
- Examples: Daiquiri, Whiskey Sour, Sidecar

**Modified Ratios for Different Styles**
- **Spirit-forward**: 3:1:1 (Manhattan, Martini variations)
- **Tropical**: 2:1:2 (Mai Tai, Zombie variations)
- **Refreshing**: 1:1:2 (Collins-style drinks)

## Understanding Flavor Intensity

Not all ingredients contribute equally to balance. Understanding the intensity of different components is crucial for proper proportioning.

### High-Intensity Ingredients
- **Strong spirits** (overproof rum, cask-strength whiskey)
- **Concentrated syrups** (grenadine, orgeat)
- **Powerful bitters** (Angostura, Peychaud's)
- **Acidic juices** (lime, lemon)

### Low-Intensity Ingredients
- **Light spirits** (vodka, light rum)
- **Diluted syrups** (simple syrup, honey syrup)
- **Mild juices** (orange, pineapple)
- **Soft herbs** (mint, basil)

## The Role of Dilution

Water plays a crucial role in cocktail balance that's often overlooked. Proper dilution helps integrate flavors and reduces alcohol intensity, making the drink more approachable.

### Sources of Dilution
- **Ice melt** during shaking or stirring
- **Fresh juice water content**
- **Club soda or tonic additions**
- **Melted ice from chilling**

### Controlling Dilution
- **Shake time**: 10-15 seconds for proper integration
- **Ice quality**: Larger cubes melt slower
- **Temperature**: Colder drinks require more dilution
- **Glass size**: Affects final dilution ratio

## Advanced Balancing Techniques

### Building Complexity Through Layers
Instead of adding more of the same ingredient, try layering different elements that serve similar functions:

- **Multiple sweeteners**: Simple syrup + liqueur + fruit
- **Acid variety**: Lemon juice + lime juice + vinegar
- **Bitter complexity**: Angostura + orange bitters + herbal liqueur

### The Importance of Texture
Balance isn't just about taste - texture plays a crucial role in the drinking experience:

- **Viscosity**: Thicker drinks feel more substantial
- **Carbonation**: Adds liveliness and cuts richness
- **Temperature**: Affects flavor perception
- **Garnish texture**: Crunch, chew, or smooth elements

## Common Balancing Mistakes

### Over-Sweetening
Many beginners add too much sweetener to mask harsh alcohol flavors. Instead, try:
- Using higher-quality spirits
- Adding more acid to cut sweetness
- Incorporating bitter elements for complexity

### Under-Acidifying
Lack of acidity makes drinks flat and uninteresting. Solutions include:
- Adding citrus juice
- Using vinegar-based shrubs
- Incorporating acidic fruits

### Ignoring Bitter Elements
Bitter components are often overlooked but essential for sophisticated drinks:
- Add dashes of bitters
- Include herbal liqueurs
- Use bitter ingredients like Campari or Aperol

## Practical Application

### Tasting and Adjusting
Always taste your cocktails before serving and adjust as needed:

1. **Taste the base**: Check spirit quality and intensity
2. **Add sweet**: Start with less than you think you need
3. **Add acid**: Balance the sweetness
4. **Add bitter**: Introduce complexity
5. **Dilute**: Adjust to proper strength
6. **Final taste**: Make final adjustments

### Recording Your Experiments
Keep notes on successful ratios and modifications. This helps you:
- Remember what works
- Build on successful experiments
- Understand your palate preferences
- Share knowledge with others

## The Art of Personal Preference

While scientific principles provide a foundation, personal taste and cultural preferences play significant roles in cocktail balance. What's perfectly balanced for one person might be too sweet, sour, or strong for another.

### Cultural Considerations
- **American preferences**: Often favor sweeter, less bitter drinks
- **European traditions**: Tend toward drier, more bitter profiles
- **Tropical styles**: Emphasize fruit and sweetness
- **Classic cocktails**: Focus on spirit-forward, complex profiles

### Adapting to Your Audience
Consider who you're making drinks for:
- **Beginners**: Start with sweeter, simpler profiles
- **Experienced drinkers**: Can handle more complex, bitter elements
- **Health-conscious**: Lower alcohol, natural sweeteners
- **Special occasions**: More elaborate, celebratory profiles

## Conclusion

Understanding the science behind cocktail balance is the foundation of great mixology. By mastering the golden ratio, recognizing flavor intensities, and learning to adjust for personal preferences, you can create consistently excellent cocktails that please both novice and experienced palates.

Remember that balance is not a destination but a journey of continuous learning and refinement. Each drink you make is an opportunity to better understand the complex interplay of flavors that creates the perfect cocktail experience.`,
        featuredImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        category: "mixology-fundamentals",
        difficulty: "intermediate",
        readingTime: 10,
        tags: ["cocktail balance", "mixology science", "flavor profiles", "golden ratio", "cocktail chemistry"],
        seo: {
          metaDescription: "Learn the science behind perfectly balanced cocktails. Discover how to achieve the ideal ratio of sweet, sour, strong, and weak elements in every drink.",
          keywords: ["cocktail balance", "mixology science", "golden ratio", "flavor profiles", "cocktail chemistry"]
        }
      },
      {
        title: "Essential Bar Tools: Your Complete Equipment Guide",
        slug: "essential-bar-tools-complete-equipment-guide",
        excerpt: "Discover the essential bar tools every home bartender needs. Learn about shakers, strainers, measuring tools, and equipment for professional-quality cocktails.",
        content: `# Essential Bar Tools: Your Complete Equipment Guide

Having the right tools is essential for creating professional-quality cocktails at home. This comprehensive guide will help you understand what equipment you need, why you need it, and how to use it effectively.

## The Foundation: Essential Tools

### 1. Cocktail Shaker
The cocktail shaker is the most iconic and essential tool in any bar setup.

**Types of Shakers:**
- **Boston Shaker**: Two-piece set (tin and glass) - most versatile
- **Cobbler Shaker**: Three-piece set with built-in strainer - beginner-friendly
- **French Shaker**: Two-piece set (tin and tin) - professional standard

**Why You Need It:**
- Rapid chilling and dilution
- Thorough mixing of ingredients
- Aeration for certain cocktails
- Professional presentation

**How to Use:**
1. Fill the larger piece with ice
2. Add all ingredients
3. Cap with the smaller piece
4. Shake vigorously for 10-15 seconds
5. Strain into prepared glass

### 2. Jigger
Precise measurement is crucial for consistent cocktails.

**Types of Jiggers:**
- **Double-sided**: 1 oz/1.5 oz or 1 oz/2 oz measurements
- **Single-sided**: One measurement size
- **Stepped**: Multiple measurement sizes

**Why You Need It:**
- Consistent drink quality
- Proper balance and proportions
- Professional accuracy
- Recipe replication

**How to Use:**
1. Pour ingredient to the rim of the appropriate side
2. Level off with a straight edge
3. Pour into mixing vessel
4. Rinse between different ingredients

### 3. Bar Spoon
A long-handled spoon essential for stirring cocktails.

**Types of Bar Spoons:**
- **Standard**: 12-15 inches long with twisted stem
- **Teaspoon end**: Small spoon at the end
- **Muddler end**: Flat end for muddling

**Why You Need It:**
- Gentle mixing without aeration
- Reaching bottom of tall glasses
- Layering drinks
- Muddling herbs and fruits

**How to Use:**
1. Hold between thumb and middle finger
2. Use back-and-forth motion (not circular)
3. Stir for 20-30 seconds
4. Feel the mixing glass become cold

### 4. Strainer
Removes ice and solids from cocktails.

**Types of Strainers:**
- **Hawthorne**: Spring-loaded, fits over shaker tin
- **Julep**: Perforated, for mixing glasses
- **Fine mesh**: For double-straining

**Why You Need It:**
- Clean, professional presentation
- Removes ice chips and pulp
- Prevents over-dilution
- Smooth texture

**How to Use:**
1. Place over shaker or mixing glass
2. Pour cocktail through strainer
3. Use fine mesh for double-straining
4. Clean between uses

### 5. Muddler
Crushes herbs, fruits, and spices to release flavors.

**Types of Muddlers:**
- **Wooden**: Traditional, gentle on glassware
- **Stainless steel**: Durable, easy to clean
- **Plastic**: Lightweight, budget-friendly

**Why You Need It:**
- Releases essential oils from herbs
- Extracts juice from fruits
- Crushes sugar cubes
- Creates fresh, aromatic cocktails

**How to Use:**
1. Place ingredients in bottom of glass
2. Press firmly but don't over-muddle
3. Twist slightly to release needed oils
4. Stop when ingredients are bruised, not pulverized

## Advanced Tools for Serious Bartenders

### 6. Mixing Glass
Essential for stirred cocktails.

**Types of Mixing Glasses:**
- **Glass**: Clear, shows the mixing process
- **Stainless steel**: Durable, keeps drinks colder
- **Crystal**: Premium, elegant presentation

**Why You Need It:**
- Proper stirring technique
- Controlled dilution
- Clear presentation
- Professional appearance

### 7. Fine Mesh Strainer
For double-straining cocktails.

**Why You Need It:**
- Removes small ice chips
- Filters out pulp and seeds
- Creates silky smooth texture
- Professional presentation

### 8. Citrus Juicer
For fresh citrus juice.

**Types of Juicers:**
- **Handheld**: Simple, effective
- **Electric**: Faster for large quantities
- **Manual press**: Maximum juice extraction

**Why You Need It:**
- Fresh, vibrant flavors
- Better than bottled juice
- Consistent results
- Cost-effective

### 9. Channel Knife
For creating citrus twists and garnishes.

**Why You Need It:**
- Professional garnishes
- Expressed citrus oils
- Visual appeal
- Aromatic enhancement

### 10. Bottle Opener
Essential for opening bottles and cans.

**Types of Openers:**
- **Waiter's corkscrew**: Versatile, compact
- **Lever corkscrew**: Easy to use
- **Electric opener**: Convenient for parties

## Glassware Essentials

### Basic Glassware Set
- **Highball glasses**: For tall drinks with ice
- **Lowball glasses**: For short drinks over ice
- **Martini glasses**: For chilled cocktails
- **Wine glasses**: For wine-based cocktails

### Specialty Glassware
- **Coupe glasses**: For champagne cocktails
- **Nick and Nora glasses**: For stirred cocktails
- **Tiki mugs**: For tropical drinks
- **Shot glasses**: For measuring and shots

## Storage and Organization

### Bar Cart or Cabinet
- **Portable cart**: Easy to move and store
- **Built-in cabinet**: Permanent home bar setup
- **Wall-mounted**: Space-saving solution

### Organization Tips
- **Group by function**: Keep similar tools together
- **Easy access**: Most-used tools within reach
- **Clean storage**: Keep tools clean and dry
- **Regular maintenance**: Clean and maintain tools regularly

## Quality Considerations

### What to Look For
- **Durability**: Tools that last with regular use
- **Functionality**: Tools that work as intended
- **Comfort**: Tools that feel good in your hands
- **Value**: Good quality for the price

### Budget vs. Premium
- **Starter set**: Focus on essential tools
- **Mid-range**: Balance of quality and price
- **Professional**: Top-quality tools for serious use

## Maintenance and Care

### Cleaning
- **After each use**: Rinse and dry immediately
- **Deep cleaning**: Regular thorough cleaning
- **Sanitizing**: Use appropriate sanitizers
- **Storage**: Keep clean and dry

### Maintenance
- **Regular inspection**: Check for wear and damage
- **Sharpening**: Keep blades sharp
- **Lubrication**: Keep moving parts lubricated
- **Replacement**: Replace worn or damaged tools

## Building Your Collection

### Starter Set (Essential Tools)
1. Cocktail shaker
2. Jigger
3. Bar spoon
4. Strainer
5. Muddler

### Intermediate Set (Add These)
1. Mixing glass
2. Fine mesh strainer
3. Citrus juicer
4. Channel knife
5. Bottle opener

### Professional Set (Complete Collection)
1. All above tools
2. Specialty glassware
3. Advanced tools
4. Premium equipment
5. Backup tools

## Conclusion

Having the right tools is essential for creating professional-quality cocktails at home. Start with the essential tools and gradually build your collection as your skills and needs develop. Remember that quality tools are an investment that will serve you well for years to come.

Focus on mastering the basic tools first, then expand your collection as you develop your skills and discover new techniques. With the right equipment and proper technique, you'll be able to create cocktails that rival those from the best bars and restaurants.`,
        featuredImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        category: "mixology-fundamentals",
        difficulty: "beginner",
        readingTime: 8,
        tags: ["bar tools", "cocktail equipment", "bartending tools", "home bar setup", "mixology equipment"],
        seo: {
          metaDescription: "Discover the essential bar tools every home bartender needs. Learn about shakers, strainers, measuring tools, and equipment for professional-quality cocktails.",
          keywords: ["bar tools", "cocktail equipment", "bartending tools", "home bar setup", "mixology equipment"]
        }
      },
      {
        title: "Building Your Home Bar: A Complete Setup Guide",
        slug: "building-home-bar-complete-setup-guide",
        excerpt: "Create the perfect home bar setup from scratch. Learn about spirits, mixers, tools, and organization for a functional and stylish home bar.",
        content: `# Building Your Home Bar: A Complete Setup Guide

Creating a home bar is an exciting journey that combines functionality, style, and personal taste. Whether you're starting from scratch or upgrading your current setup, this comprehensive guide will help you build a home bar that's both practical and impressive.

## Planning Your Home Bar

### Assess Your Space
Before you start buying equipment and spirits, evaluate your available space:

**Considerations:**
- **Available space**: Measure your area carefully
- **Storage needs**: Plan for tools, glassware, and spirits
- **Workflow**: Ensure easy access to all components
- **Ventilation**: Consider air circulation for comfort
- **Lighting**: Plan for adequate task lighting

### Choose Your Style
Your home bar should reflect your personal style and the atmosphere you want to create:

**Style Options:**
- **Classic**: Traditional, elegant, timeless
- **Modern**: Sleek, minimalist, contemporary
- **Rustic**: Natural materials, warm, inviting
- **Industrial**: Metal, concrete, urban aesthetic
- **Tropical**: Bright colors, beach vibes, fun

## Essential Spirits Collection

### The Foundation Six
Start with these versatile base spirits that will allow you to make hundreds of cocktails:

**1. Vodka**
- **Brands**: Tito's, Absolut, Grey Goose
- **Uses**: Versatile mixer, neutral base
- **Cocktails**: Moscow Mule, Vodka Tonic, Bloody Mary

**2. Gin**
- **Brands**: Beefeater, Bombay Sapphire, Hendrick's
- **Uses**: Botanical cocktails, classic drinks
- **Cocktails**: Gin and Tonic, Martini, Negroni

**3. Whiskey**
- **Brands**: Buffalo Trace, Maker's Mark, Jameson
- **Uses**: Classic cocktails, sipping
- **Cocktails**: Old Fashioned, Whiskey Sour, Manhattan

**4. Rum**
- **Brands**: Bacardi, Captain Morgan, Appleton Estate
- **Uses**: Tropical drinks, classic cocktails
- **Cocktails**: Mojito, Daiquiri, Rum and Coke

**5. Tequila**
- **Brands**: Patrón, Don Julio, Casamigos
- **Uses**: Mexican cocktails, modern drinks
- **Cocktails**: Margarita, Paloma, Tequila Sunrise

**6. Brandy**
- **Brands**: Hennessy, Rémy Martin, Courvoisier
- **Uses**: After-dinner drinks, classic cocktails
- **Cocktails**: Sidecar, Brandy Alexander, French 75

### Essential Liqueurs
These liqueurs will significantly expand your cocktail repertoire:

**Sweet Liqueurs:**
- **Cointreau**: Orange liqueur for Margaritas and Sidecars
- **Grand Marnier**: Premium orange liqueur
- **Chambord**: Raspberry liqueur for French Martinis
- **Baileys**: Irish cream for dessert cocktails

**Herbal Liqueurs:**
- **Chartreuse**: Green and yellow varieties
- **Bénédictine**: Herbal liqueur for Vieux Carré
- **Drambuie**: Honey and herb liqueur
- **Galliano**: Vanilla and herb liqueur

**Bitter Liqueurs:**
- **Campari**: Italian bitter for Negronis
- **Aperol**: Lighter bitter for Aperol Spritzes
- **Fernet-Branca**: Intense herbal bitter
- **Cynar**: Artichoke-based bitter

## Essential Mixers and Ingredients

### Fresh Ingredients
- **Citrus fruits**: Lemons, limes, oranges
- **Fresh herbs**: Mint, basil, rosemary, thyme
- **Simple syrup**: Easy to make at home
- **Grenadine**: Pomegranate syrup for color and flavor

### Bottled Mixers
- **Tonic water**: Premium brands like Fever-Tree
- **Club soda**: For highballs and spritzers
- **Ginger beer**: For Moscow Mules and Dark and Stormys
- **Cranberry juice**: For Cosmopolitans and Cape Cods

### Bitters
- **Angostura**: Classic aromatic bitters
- **Orange bitters**: For Martinis and Old Fashioneds
- **Peychaud's**: For Sazeracs and New Orleans cocktails
- **Chocolate bitters**: For dessert cocktails

## Glassware Collection

### Essential Glassware
- **Highball glasses**: For tall drinks with ice
- **Lowball glasses**: For short drinks over ice
- **Martini glasses**: For chilled cocktails
- **Wine glasses**: For wine-based cocktails
- **Champagne flutes**: For sparkling cocktails

### Specialty Glassware
- **Coupe glasses**: For champagne cocktails
- **Nick and Nora glasses**: For stirred cocktails
- **Tiki mugs**: For tropical drinks
- **Shot glasses**: For measuring and shots

## Bar Tools and Equipment

### Essential Tools
- **Cocktail shaker**: Boston shaker or cobbler shaker
- **Jigger**: For precise measurements
- **Bar spoon**: For stirring and muddling
- **Strainer**: Hawthorne and julep strainers
- **Muddler**: For crushing herbs and fruits

### Advanced Tools
- **Mixing glass**: For stirred cocktails
- **Fine mesh strainer**: For double-straining
- **Citrus juicer**: For fresh juice
- **Channel knife**: For citrus twists
- **Bottle opener**: For opening bottles and cans

## Organization and Storage

### Storage Solutions
- **Bar cart**: Portable and stylish
- **Built-in cabinet**: Permanent home bar setup
- **Wall-mounted**: Space-saving solution
- **Floating shelves**: Display and storage

### Organization Tips
- **Group by function**: Keep similar items together
- **Easy access**: Most-used items within reach
- **Clean storage**: Keep items clean and organized
- **Regular maintenance**: Clean and maintain regularly

## Lighting and Atmosphere

### Task Lighting
- **Under-cabinet lighting**: For workspace illumination
- **Pendant lights**: For focused lighting
- **LED strips**: For modern, energy-efficient lighting
- **Dimmer switches**: For adjustable ambiance

### Ambient Lighting
- **String lights**: For warm, inviting atmosphere
- **Candles**: For intimate, romantic lighting
- **Lamps**: For soft, diffused lighting
- **Natural light**: Maximize daylight when possible

## Budget Considerations

### Starter Budget ($200-400)
- **Essential spirits**: 6 base spirits
- **Basic tools**: Shaker, jigger, spoon, strainer
- **Simple glassware**: 4-6 glasses
- **Basic mixers**: Tonic, soda, simple syrup

### Intermediate Budget ($400-800)
- **Expanded spirits**: Add liqueurs and bitters
- **Better tools**: Upgrade to professional quality
- **More glassware**: Add specialty glasses
- **Premium mixers**: Better quality mixers

### Premium Budget ($800+)
- **Top-shelf spirits**: Premium brands
- **Professional tools**: Restaurant-quality equipment
- **Complete glassware**: Full collection
- **Premium mixers**: Artisanal and craft mixers

## Maintenance and Care

### Daily Maintenance
- **Clean as you go**: Rinse tools immediately after use
- **Wipe down surfaces**: Keep bar area clean
- **Check inventory**: Monitor spirit levels
- **Fresh ingredients**: Replace as needed

### Weekly Maintenance
- **Deep clean**: Thorough cleaning of all equipment
- **Inventory check**: Assess what needs restocking
- **Organization**: Reorganize and tidy up
- **Tool maintenance**: Clean and maintain tools

### Monthly Maintenance
- **Spirit rotation**: Rotate stock to prevent spoilage
- **Equipment check**: Inspect for wear and damage
- **Deep cleaning**: Thorough cleaning of entire setup
- **Upgrade planning**: Plan for improvements

## Personalization and Style

### Decor and Accessories
- **Artwork**: Bar-themed prints or photos
- **Plants**: Fresh herbs or decorative plants
- **Books**: Cocktail books for reference
- **Music**: Sound system for atmosphere

### Customization
- **Personal touches**: Family photos or mementos
- **Theme elements**: Consistent design theme
- **Color scheme**: Coordinated colors
- **Textures**: Mix of materials and textures

## Conclusion

Building a home bar is a rewarding project that combines practical functionality with personal style. Start with the essentials and gradually build your collection as your skills and preferences develop. Remember that the best home bar is one that reflects your personality and meets your specific needs.

Focus on quality over quantity, and don't be afraid to experiment with different styles and arrangements. With proper planning and care, your home bar will become a centerpiece of your home and a source of enjoyment for years to come.`,
        featuredImage: "https://images.unsplash.com/photo-1587223962930-cb7f317f862c?w=800&h=600&fit=crop",
        category: "mixology-fundamentals",
        difficulty: "beginner",
        readingTime: 11,
        tags: ["home bar setup", "bar organization", "cocktail equipment", "bar design", "home bar planning"],
        seo: {
          metaDescription: "Create the perfect home bar setup from scratch. Learn about spirits, mixers, tools, and organization for a functional and stylish home bar.",
          keywords: ["home bar setup", "bar organization", "cocktail equipment", "bar design", "home bar planning"]
        }
      }
    ];

    // Add the articles
    const results = [];
    for (const article of articles) {
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
      } catch (error: any) {
        console.error(`Failed to add article "${article.title}":`, error);
        results.push({
          title: article.title,
          category: article.category,
          status: 'error',
          error: error.message
        });
      }
    }

    // Update the category article count
    await adminDb.collection('education_categories').doc(categoryRef.id).update({
      articleCount: results.filter(r => r.status === 'success').length,
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      message: `Created Fundamentals category and added ${results.filter(r => r.status === 'success').length} articles successfully`, 
      categoryId: categoryRef.id,
      results 
    });
  } catch (error: any) {
    console.error("Error creating Fundamentals category:", error);
    return NextResponse.json({ success: false, error: "Failed to create category and articles", details: error.message }, { status: 500 });
  }
}
