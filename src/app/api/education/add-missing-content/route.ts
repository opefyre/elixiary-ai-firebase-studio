import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articles = [
      {
        id: "pMVTcY3wL30w014NlV1q",
        slug: "instagram-worthy-cocktail-presentations",
        content: `# Creating Instagram-Worthy Cocktail Presentations

Visual presentation elevates cocktails from drinks to experiences. Instagram-worthy cocktails combine taste with visual artistry, creating moments worth sharing.

## Elements of Visual Appeal

### Color Harmony

**Vibrant Contrasts:**
- Use naturally colorful ingredients
- Create layers of color
- Garnish with colorful elements
- Balance bright and subtle tones

**Natural Colors:**
- Fresh fruit colors
- Herb greens
- Citrus yellows
- Berry purples and reds

### Glassware Selection

**Right Glass for the Drink:**
- Coupe for elegant sours
- Highball for tall drinks
- Rocks glass for stirred cocktails
- Unique shapes for special drinks

**Quality Matters:**
- Clear crystal
- No chips or scratches
- Proper size
- Clean presentation

## Garnish Strategy

### Edible Decorations

**Fresh Fruit:**
- Citrus wheels
- Berries
- Pineapple wedges
- Apple slices

**Herbs:**
- Fresh mint sprigs
- Rosemary stalks
- Basil leaves
- Thyme branches

### Functional Garnishes

**Enhance Aroma:**
- Citrus peels
- Fresh herbs
- Spices
- Flowers

**Add to Experience:**
- Contribute flavor
- Enhance presentation
- Complete the drink
- Professional touch

## Lighting and Photography

### Natural Light Best

**Photography Tips:**
- Near window
- Soft, diffused light
- Avoid harsh shadows
- Show true colors

**Composition:**
- Rule of thirds
- Interesting angles
- Clean backgrounds
- Focus on drink

### Styling Secrets

**Professional Looks:**
- Fresh ice
- Clean glass edges
- Proper foam
- No condensation unless intentional

**Small Details Matter:**
- Perfect garnish placement
- Neat pour lines
- Consistent ice
- Professional presentation

## Technical Excellence

### Consistent Quality

**Every Time:**
- Same technique
- Same proportions
- Same garnish style
- Reproducible results

**Attention to Detail:**
- No spills
- Clean surfaces
- Organized setup
- Professional appearance

## Social Media Optimization

### Best Practices

**Photography:**
- Good lighting
- Interesting angles
- Clean backgrounds
- Focus on drink

**Hashtags and Captions:**
- Relevant tags
- Descriptive captions
- Brand consistency
- Engage audience

## Pro Tips

- Use fresh, high-quality ingredients
- Keep equipment clean
- Practice presentation
- Develop your style
- Be consistent
- Invest in good glassware
- Plan the photo before making
- Keep backgrounds simple
- Natural light always best
- Have everything ready`,
        readingTime: 10
      },
      {
        id: "qYFk8aPTtCfbr9Hahw1J",
        slug: "essential-bar-tools-complete-equipment-guide",
        content: `# Essential Bar Tools: A Complete Equipment Guide

Quality tools make quality drinks. Professional bartenders invest in equipment that performs consistently and lasts.

## Core Tools

### Shaker Set

**Boston Shaker:**
- Two-piece design
- Pint glass and metal tin
- Commercial bar standard
- Large capacity

**Cobbler Shaker:**
- Three-piece design
- Built-in strainer
- Convenient for home bars
- All-in-one solution

**Quality Indicators:**
- Thick, durable metal
- Tight seal
- No leaks
- Professional brands

### Strainers

**Hawthorne Strainer:**
- Spring coils
- Fits shaker opening
- Catches ice and solids
- Essential tool

**Julep Strainer:**
- For stirred drinks
- Perforated design
- Fits mixing glass
- Classic tool

**Fine Mesh Strainer:**
- Double strain important
- Catches tiny ice chips
- Removes pulp
- Crystal-clear drinks

### Bar Spoon

**Features:**
- Long handle (10-12 inches)
- Twisted shaft
- Multipurpose tool

**Uses:**
- Stirring cocktails
- Layering drinks
- Reaching bottom of tall glass
- Measuring small amounts

### Muddler

**Types:**
- Wood traditional
- Plastic food-grade
- Stainless steel tip

**Function:**
- Extract oils from herbs
- Mash fruits gently
- Release juices
- Create flavor foundation

## Measuring Tools

### Jiggers

**Essential for Consistency:**
- Accurate measurements
- Multiple sizes
- Clear markings
- Quality stainless steel

**Standard Sizes:**
- 1 oz / 1.5 oz
- 0.5 oz / 1 oz
- 1.5 oz / 2 oz

**Why Accuracy Matters:**
- Consistent drinks
- Balanced flavors
- Professional quality
- Repeatable results

### Measuring Spoons

**For Small Quantities:**
- Bitters
- Syrups
- Salt
- Spices

## Cutting Tools

### Channel Knife

**Functions:**
- Create citrus twists
- Make decorative spirals
- Professional garnish tool
- Adds elegance

### Paring Knife

**Versatile Tool:**
- Fresh fruit prep
- Clean cuts
- Garnish preparation
- Multiple uses

## Additional Essentials

### Mixing Glass

**For Stirred Drinks:**
- Clear crystal best
- Heavy base
- 16-20 oz capacity
- Professional look

### Ice Tools

**Ice Pick:**
- Break large ice
- Custom pieces
- Classic tool

**Ice Tongs:**
- Handle ice hygienically
- Professional presentation
- Essential for service

### Juice Squeezer

**Fresh Juice:**
- Hand or electric
- Consistent results
- Fresh flavor
- Quality improvement

## Investment Strategy

### Buy Quality Once

**Why It Matters:**
- Lasts decades
- Better performance
- Professional results
- Cost-effective long term

**Recommended Brands:**
- Koriko
- Japanese Yarai
- Korin
- Professional suppliers

### Starter Kit Essentials

**Minimum Required:**
- Shaker set
- Hawthorne strainer
- Jigger
- Bar spoon
- Muddler
- Citrus squeezer

**Professional Addition:**
- Fine mesh strainer
- Mixing glass
- Julep strainer
- Multiple jiggers
- Channel knife

## Maintenance

### Proper Care

**Cleaning:**
- Hand wash immediately
- Dry completely
- Store properly
- Regular maintenance

**Longevity:**
- Quality tools last
- Proper care extends life
- Professional investment
- Value over time

## Pro Tips

- Invest in quality over quantity
- Buy tools as you need them
- Maintain equipment properly
- Upgrade incrementally
- Test before buying
- Read reviews
- Shop professional suppliers
- Buy once, cry once philosophy
- Quality improves drinks
- Tools are investment`,
        readingTime: 14
      },
      {
        id: "xpJ6aoOheZarmmwyyEBm",
        slug: "garnish-essentials-elevating-cocktail-presentation",
        content: `# Garnish Essentials: Elevating Your Cocktail Presentation

Garnishes aren't just decoration—they enhance aroma, flavor, and the entire drinking experience.

## Purpose of Garnishes

### Aromatic Enhancement

**Essential Oils:**
- Release when squeezed or twisted
- Enhance the nose
- First impression matters
- Set flavor expectations

**Aromatic Elements:**
- Citrus peels
- Fresh herbs
- Spices
- Flowers

### Visual Appeal

**Beautiful Presentation:**
- Professional appearance
- Instagram-worthy
- Complete the drink
- Elevate experience

**Why It Matters:**
- First impression is visual
- People eat (and drink) with eyes
- Garnish completes story
- Shows attention to detail

## Classic Garnishes

### Citrus Twists

**Types:**
- Lemon twists
- Lime twists
- Orange twists
- Grapefruit twists

**Technique:**
- Express oils over drink
- Twist peel above glass
- Mist oils onto surface
- Rim glass edge

**Visual Appeal:**
- Bright colors
- Clean lines
- Professional look
- Classic elegance

### Fresh Herbs

**Mint:**
- Mojitos
- Juleps
- Fresh and aromatic
- Classic choice

**Rosemary:**
- Gin drinks
- Herbal cocktails
- Elegant spike
- Aromatic

**Basil:**
- Gimlets
- Fresh cocktails
- Unique flavor
- Distinctive

**Other Herbs:**
- Thyme
- Sage
- Lavender
- Cilantro

### Fruit Garnishes

**Cherries:**
- Manhattan
- Old Fashioned
- Classic red
- Sweet touch

**Berries:**
- Colorful accents
- Fresh flavor
- Visual interest
- Seasonal

**Pineapple:**
- Tropical drinks
- Wedges or spears
- Sweet and juicy
- Exotic

## Professional Techniques

### Expressing Oils

**Citrus Technique:**
1. Cut fresh peel
2. Hold over drink
3. Twist and squeeze
4. Oils mist onto surface
5. Skim peel rim
6. Drop or discard

**Why It Matters:**
- Aromatic enhancement
- Flavor contribution
- Professional technique
- Essential skill

### Placement Strategy

**Visual Balance:**
- Don't block the drink
- Easy to drink around
- Complements glass shape
- Appropriate size

**Functional Beauty:**
- Looks great
- Easy to remove
- Enhances aroma
- Adds to flavor

## Garnish by Drink Type

### Classic Cocktails

**Martini:**
- Lemon twist or olive
- Sophisticated and simple
- Your choice
- Classic presentation

**Old Fashioned:**
- Orange peel twist
- Cherry optional
- Traditional garnish
- Perfect finish

**Manhattan:**
- Cherry (brandied)
- Classic presentation
- Traditional touch
- Sophisticated

### Tropical Drinks

**Mojito:**
- Mint sprig and lime
- Fresh and tropical
- Classic combination
- Refreshing look

**Mai Tai:**
- Mint sprig
- Cherry or cherry + pineapple
- Tropical presentation
- Exotic appeal

**Piña Colada:**
- Pineapple wedge
- Cherry
- Tropical paradise
- Perfect finish

### Gin Cocktails

**Gin & Tonic:**
- Lime wedge or cucumber
- Fresh and simple
- Classic pairing
- Refreshing

**Negroni:**
- Orange peel
- Classic Italian
- Sophisticated
- Perfect balance

## Advanced Techniques

### Layered Garnishes

**Multiple Elements:**
- Combine citrus and herb
- Skewer fruits
- Create arrangements
- Be creative

**Balance:**
- Don't overdo it
- Less can be more
- Quality over quantity
- Clean presentation

### Expressive Garnishes

**Channel Peeler Spirals:**
- Long citrus spirals
- Elegant presentation
- Professional touch
- Impressive details

**Herb Bouquets:**
- Multiple herb types
- Arranged beautifully
- Aromatic blend
- Visual interest

## Common Mistakes

**To Avoid:**
- Over-garnishing
- Wrong garnish for drink
- Poor quality ingredients
- Bad placement
- Too large
- Inconsistent placement

## Best Practices

### Fresh Ingredients Only

**Quality Matters:**
- Use fresh, not dried
- Bright, vibrant colors
- No wilting or browning
- Best quality available

### Proper Technique

**Express Citrus Oils:**
- Always twist peels
- Mist oils onto drink
- Enhance aroma
- Professional standard

### Minimal and Intentional

**Less Is More:**
- One great garnish vs many mediocre
- Each element matters
- Purposeful placement
- Clean presentation

### Consistency

**Same Drink, Same Garnish:**
- Standardize recipes
- Train staff
- Consistent quality
- Professional reputation

## Pro Tips

- Express citrus oils always
- Keep garnishes fresh
- Practice technique
- Match garnish to drink
- Use right tools
- Quality ingredients
- Consistent placement
- Don't overdo it
- Match garnish size to glass
- Professional presentation`,
        readingTime: 9
      }
    ];

    const results = [];
    
    for (const article of articles) {
      try {
        await adminDb.collection('education_articles').doc(article.id).update({
          content: article.content,
          readingTime: article.readingTime,
          updatedAt: new Date(),
          wordCount: article.content.split(/\s+/).length,
          lastReviewed: new Date()
        });
        
        results.push({
          success: true,
          articleId: article.id,
          slug: article.slug,
          wordCount: article.content.split(/\s+/).length,
          contentLength: article.content.length
        });
      } catch (error: any) {
        results.push({
          success: false,
          articleId: article.id,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "All 3 articles updated",
      total: 3,
      results
    });
  } catch (error: any) {
    console.error("Error updating articles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
