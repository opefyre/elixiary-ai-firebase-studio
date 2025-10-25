import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "mastering-stirring-cocktails";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# Mastering the Fine Art of Stirring Cocktails

Stirring is one of the most fundamental yet nuanced techniques in mixology. While shaking gets the spotlight for its dramatic flair, stirring is where the true artistry of cocktail-making lies. This comprehensive guide explores the science, technique, and finesse required to master the art of stirring cocktails to perfection.

## Why Stir Instead of Shake?

### The Purpose of Stirring

**What Stirring Does:**
- Dilutes cocktails with melted ice water
- Chills the mixture evenly
- Combines ingredients without aerating
- Creates silky, smooth texture
- Preserves clarity in transparent drinks

**When to Stir:**
- Spirits-forward cocktails (Manhattan, Martini, Old Fashioned)
- Drinks with only alcoholic ingredients
- When you want a clear, transparent cocktail
- When texture should be velvety, not frothy
- Classic cocktails that call for stirring

### The Difference Between Stirring and Shaking

**Stirring Characteristics:**
- No aeration or foam
- Cleaner presentation
- Smoother mouthfeel
- Preserves spirits' delicate flavors
- Professional bartender standard

**Shaking Characteristics:**
- Adds texture and froth
- More vigorous dilution
- Incorporates air bubbles
- Best for cocktails with juices or dairy
- More dramatic presentation

## The Science of Stirring

### How Dilution Works

**Ice Melting Process:**
- Ice melts when it contacts warmer liquid
- Creates cold water that dilutes the drink
- Brings cocktail to optimal drinking temperature
- Balances alcohol intensity
- Makes flavors more approachable

**Ideal Dilution:**
- Too little: Drinks taste too strong, harsh
- Just right: Balanced, smooth, refreshing
- Too much: Watered down, flavorless
- Target: 20-25% increase in volume from ice melt
- Professional sweet spot: 30-45 seconds of stirring

### Temperature and Viscosity

**The Role of Cold:**
- Cold reduces perception of alcohol burn
- Allows subtle flavors to emerge
- Creates refreshing experience
- Ideal serving temperature: 28-32°F
- Too cold (below 25°F): Numb taste buds

**Viscosity Changes:**
- Cold increases liquid viscosity slightly
- Creates creamier mouthfeel
- Changes how liquid coats your tongue
- Affects flavor perception
- Professional bartenders understand this

## Essential Equipment for Stirring

### The Bar Spoon

**Types of Bar Spoons:**
- **Standard Bar Spoon**: Long handle (10-12 inches), twisted stem
- **Japanese Style**: Longer handle, weighted end, precise
- **European Style**: Ornate design, decorative
- **Functional**: Designed for stirring, not decoration

**Why Length Matters:**
- Reaches bottom of mixing glass
- Allows proper technique
- Prevents ice spillage
- Comfortable hand position
- Professional standard length

### Mixing Glass Selection

**Best Materials:**
- Clear crystal (Japanese Yarai)
- Heavy base for stability
- No design patterns on bottom
- 16-20 oz capacity
- Professional quality construction

**Size Considerations:**
- Too small: Constrains stirring motion
- Too large: Wastes ice, harder to control
- Just right: Comfortable stirring with control
- Standard: 16-18 oz capacity
- Room for ice and liquid

### Ice Quality

**Optimal Ice for Stirring:**
- Large, dense cubes
- Minimal air bubbles (clear ice preferred)
- Consistent size (1.5-2 inch cubes)
- Fresh, hard ice that resists cracking
- Enough cubes to fill most of mixing glass

**Why Ice Quality Matters:**
- Poor ice melts too fast (over-dilution)
- Airy ice melts inconsistently
- Large cubes melt slowly and uniformly
- Clear ice has no impurities
- Quality ice = quality drinks

## The Technique: How to Stir Properly

### Proper Grip and Positioning

**Holding the Bar Spoon:**
- Pinch between thumb and index finger
- Middle finger supports for stability
- Spiral end of handle between fingers
- Comfortable, relaxed grip
- Not too tight or loose

**Hand Position:**
- Wrist slightly elevated
- Elbow in, comfortable
- Smooth rotating motion
- Consistent speed and rhythm
- Professional appearance

### The Stirring Motion

**Basic Technique:**
1. Insert spoon to bottom of mixing glass
2. Rotate spoon in circular motion
3. Keep spoon against side of glass
4. Maintain consistent speed
5. Stir for 30-45 seconds

**Motion Details:**
- Smooth, controlled circles
- Push ice around, not just through
- Stir slowly enough to control dilution
- Fast enough for proper chilling
- Professional rhythm and cadence

### Common Mistakes to Avoid

**Mistake 1: Stirring Too Fast**
- Problem: Turbulence creates unwanted aeration
- Result: Defeats purpose of stirring
- Solution: Slower, controlled motion

**Mistake 2: Not Stirring Long Enough**
- Problem: Insufficient dilution and chilling
- Result: Harsh, warm cocktail
- Solution: 30-45 seconds minimum

**Mistake 3: Stirring Too Slowly**
- Problem: Ice doesn't move enough
- Result: Inconsistent chilling
- Solution: Moderate, consistent speed

**Mistake 4: Not Reaching Bottom**
- Problem: Layering of ingredients
- Result: Uneven mixing
- Solution: Keep spoon at bottom

**Mistake 5: Lifting Spoon Too High**
- Problem: Breaks surface and aerates
- Result: Loses clarity
- Solution: Keep top submerged

## Mastering Dilution Control

### Reading Your Drink

**Visual Cues:**
- Notice how ice cubes change
- Watch for condensation on glass
- Observe slight increase in volume
- See smooth, consistent motion
- Professional eye for doneness

**Taste Testing:**
- Professional bartenders taste
- Check for balance and temperature
- Adjust stirring time as needed
- Learn to recognize perfect dilution
- Develop palate for ideal dilution

### Time Guidelines

**Stirring Duration:**
- 30-45 seconds: Standard for most drinks
- 45-60 seconds: Spirit-forward, strong cocktails
- 20-30 seconds: Lighter cocktails, pre-chilled ingredients
- Adjust based on ice quality and temperature
- Always test and adjust

**Factors Affecting Time:**
- Ice temperature and quality
- Room temperature
- Starting temperature of ingredients
- Size and number of ice cubes
- Volume of liquid to chill

## Advanced Stirring Techniques

### The Japanese Method

**Circular Motion Technique:**
- Stir in tight circles along glass edge
- Keep spoon against side continuously
- Create smooth, flowing motion
- Professional Japanese bartender technique
- Maximizes efficiency and control

**Why It's Superior:**
- More efficient ice movement
- Better control over dilution
- Consistent chilling throughout
- Professional presentation
- Quiet, focused technique

### The Figure-Eight Method

**Alternating Motion:**
- Create figure-eight patterns
- Moves ice through different paths
- Ensures thorough mixing
- Some bartenders prefer this
- Adds slight variation

**When to Use:**
- Larger mixing glasses
- Thicker cocktails
- Personal preference
- Variation on standard technique
- Creating consistent results

### Two-Handed Stirring

**Professional Technique:**
- One hand holds mixing glass
- Other hand stirs with spoon
- Rotate glass while stirring
- Requires practice and coordination
- Impressive to watch

**Advantages:**
- Maximum ice movement
- Optimal mixing and chilling
- Shows advanced skill
- Professional presentation
- Precise control

## Stirring by Drink Type

### Spirit-Forward Cocktails

**Classic Examples:**
- Manhattan
- Martini
- Old Fashioned
- Negroni
- Boulevardier

**Stirring Approach:**
- 30-45 seconds minimum
- Check dilution carefully
- Taste for balance
- Serve at proper temperature
- Strain into chilled glass

### Aperitifs and Digestifs

**Light, Aromatic Drinks:**
- Americano
- Aperol Spritz
- Boulevardier
- Vermouth-based drinks

**Stirring Considerations:**
- May need less time
- Preserve delicate aromatics
- Watch for over-dilution
- Balance citrus and bitterness
- Lighter touch

### Cocktails with Liqueurs

**Complex Flavor Profiles:**
- Drinks with multiple liqueurs
- Bitters-heavy cocktails
- Layered flavor profiles

**Stirring Approach:**
- Thorough mixing essential
- Combine all flavors evenly
- Check for integration
- Balance all components
- Ensure harmony

## Perfecting Your Stir

### Developing Consistency

**Practice and Repetition:**
- Stir same cocktail repeatedly
- Note timing and results
- Taste each version
- Adjust technique
- Build muscle memory

**Standardization:**
- Establish your timing
- Create repeatable process
- Develop consistency
- Professional approach
- Build confidence

### Building Intuition

**Sensing the Right Moment:**
- Feel temperature change
- Notice ice consistency
- See visual changes
- Develop bartender's intuition
- Learn to read the drink

**Making Adjustments:**
- Taste and evaluate
- Adjust technique as needed
- Account for variables
- Respond to ingredients
- Professional flexibility

## Professional Tips and Secrets

### Pre-Chilling Ingredients

**Why It Helps:**
- Reduces chilling time
- Better control over dilution
- Consistent results
- Professional approach
- Time efficiency

**What to Pre-Chill:**
- Vermouth
- Liqueurs
- Mixed ingredients
- Mixing glass itself
- Everything possible

### Using a Glass Mat

**Protecting Surfaces:**
- Prevents glass from sticking
- Allows smooth motion
- Professional setup
- Proper presentation
- Essential equipment

### The Sound of Quality

**What You Hear:**
- Ice cubes clinking smoothly
- No harsh cracking sounds
- Consistent rhythm
- Professional audio
- Quality indication

**Training Your Ear:**
- Listen while you stir
- Recognize good sound
- Identify issues by sound
- Develop auditory skill
- Professional awareness

## Troubleshooting Common Issues

### Over-Dilution

**Causes:**
- Stirring too long
- Ice melting too fast
- Too many ice cubes
- Room temperature too warm

**Solutions:**
- Reduce stirring time
- Use colder, harder ice
- Fewer ice cubes
- Chill ingredients first

### Under-Dilution

**Causes:**
- Not stirring long enough
- Ice too cold and hard
- Insufficient ice cubes
- Room too cold

**Solutions:**
- Increase stirring time
- Let ice temper slightly
- More ice cubes
- Stir longer or harder

### Uneven Chilling

**Causes:**
- Inconsistent stirring
- Poor ice distribution
- Not enough ice
- Irregular cube sizes

**Solutions:**
- Maintain consistent motion
- Ensure ice fills glass
- Add more ice
- Use uniform cube sizes

## The Art of Presentation

### Final Strain

**Proper Straining:**
- Use Julep strainer or fine mesh
- Pour into chilled glass
- Control pour speed
- Prevent splashing
- Professional presentation

**Finishing Touch:**
- Check for ice chips
- Ensure clarity
- Smooth, clean pour
- Impressive final product
- Attention to detail

### Maintaining Temperature

**Serving Properly:**
- Serve immediately after stirring
- Use chilled glassware
- Don't let sit
- Preserve cold temperature
- Maintain quality

## Learning from the Masters

### Japanese Bartending Philosophy

**Precision and Respect:**
- Every movement considered
- Respect for ingredients
- Focus on perfection
- Dedication to craft
- Professional discipline

**Continuous Improvement:**
- Always refining technique
- Learning from mistakes
- Seeking perfection
- Professional mindset
- Growth and development

### Building Your Skill

**Daily Practice:**
- Stir drinks regularly
- Taste and adjust
- Seek feedback
- Compare to standards
- Improve consistently

**Study and Learn:**
- Watch professional bartenders
- Read cocktail books
- Understand theory
- Practice techniques
- Develop expertise

## Conclusion

Mastering the art of stirring cocktails is about more than just moving a spoon—it's about understanding dilution, respecting ingredients, and developing the intuition to create perfectly balanced drinks. Whether you're stirring a classic Manhattan or exploring new stirred creations, the technique you develop will elevate every cocktail you make.

**Key Takeaways:**
- Stir spirit-forward cocktails for clarity and smoothness
- Use quality ice and proper equipment
- Stir for 30-45 seconds, adjusting as needed
- Develop consistent technique through practice
- Taste and adjust for perfect dilution

**Remember:**
- Slow, controlled motion is key
- Practice develops consistency and intuition
- Quality equipment makes a difference
- Every cocktail deserves proper stirring
- Mastery comes with dedicated practice

The path to mastering stirring is one of patience, practice, and attention to detail. Each stirred cocktail is an opportunity to refine your technique and move closer to bartending excellence. Here's to stirring your way to perfection!`;

    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 18,
      updatedAt: new Date(),
      wordCount: fullContent.split(/\s+/).length,
      lastReviewed: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Article updated with full content successfully",
      articleId: articleId,
      wordCount: fullContent.split(/\s+/).length,
      contentLength: fullContent.length
    });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
