import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Find the article by slug
    const articleSlug = "art-of-shaking-perfect-cocktail-technique";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    // Full comprehensive content
    const fullContent = `# The Art of Shaking: Perfect Your Cocktail Technique

Shaking cocktails is one of the most fundamental and exciting techniques in mixology. When done correctly, it creates perfectly chilled, well-integrated drinks with beautiful texture. This comprehensive guide will teach you everything you need to master the art of shaking.

## Why We Shake Cocktails

Shaking serves multiple essential purposes that are impossible to achieve through stirring:

### 1. Rapid Cooling
Shaking cools your cocktail quickly and efficiently. The violent agitation creates maximum contact between ice and liquid, rapidly lowering the temperature to the ideal serving range of 28-32°F.

### 2. Thorough Integration
Vigorous shaking thoroughly mixes ingredients of different densities - spirits, citrus juice, syrups, and liqueurs - ensuring every sip tastes balanced and complete.

### 3. Aeration and Texture
Shaking introduces tiny air bubbles, creating a light, frothy texture that's impossible to achieve through stirring. This is especially important for cocktails with egg whites or cream.

### 4. Proper Dilution
Ice melting during shaking adds exactly the right amount of water to balance your cocktail's flavors and reduce alcohol intensity.

### 5. Breaking Down Ingredients
For cocktails with egg whites or dairy, shaking breaks down proteins and fats, creating silky, smooth textures.

## When to Shake (The Golden Rules)

Always shake cocktails containing:

### Citrus Juice
- **Daiquiri**: Lime juice needs full integration
- **Whiskey Sour**: Lemon juice requires vigorous mixing
- **Margarita**: Fresh lime juice deserves a good shake
- **Sidecar**: Lemon juice and liqueur need blending

### Egg Whites
- **Pisco Sour**: Egg white creates signature foam
- **Whiskey Sour (with egg)**: Silky texture requires shaking
- **Ramos Gin Fizz**: Double shake for perfect foam
- **Clover Club**: Raspberry and egg white harmony

### Dairy or Cream
- **White Russian**: Cream needs complete integration
- **Grasshopper**: Mint and cream must meld perfectly
- **Brandy Alexander**: Cream creates luxurious texture

### Thick Syrups or Purees
- **Mai Tai**: Orgeat needs thorough mixing
- **Piña Colada**: Pineapple puree requires blending
- **Bloody Mary**: Tomato juice needs full integration

### Any Drink with Complex Ingredients
- **Cosmopolitan**: Multiple juices need shaking
- **Long Island Iced Tea**: Many ingredients require vigorous mixing
- **Tropical drinks**: Fruit-forward cocktails benefit from shaking

## Choosing the Right Shaker

Your shaker choice affects your technique and results:

### Boston Shaker (Most Popular)
**Two-piece system**: Large tin + mixing glass or second tin

**Advantages:**
- Professional standard worldwide
- Excellent heat conduction
- Large capacity
- Versatile and durable
- Fast heat transfer

**How to Use:**
1. Fill large tin 2/3 with ice
2. Add all ingredients
3. Place smaller piece on top at an angle
4. Give a sharp tap to seal
5. Shake vigorously
6. Break seal and strain

### Cobbler Shaker (Beginner-Friendly)
**Three-piece system**: Bottom + strainer lid + cap

**Advantages:**
- Self-contained strainer
- Easy to use
- No separate strainer needed
- Good for home bars

**How to Use:**
1. Fill bottom 2/3 with ice
2. Add ingredients
3. Screw on lid with strainer
4. Add cap
5. Shake vigorously
6. Remove cap and strain

### French Shaker
**Two-piece system**: Both pieces are metal

**Advantages:**
- Sleek, modern design
- Good heat conduction
- Lightweight and portable

## The Perfect Shake Technique

### Step 1: Prepare Your Ingredients
- Measure everything with a jigger
- Have all ingredients ready before starting
- Use fresh ice for each drink
- Keep ingredients chilled when possible

### Step 2: Add Ice
- Fill shaker 2/3 full with ice
- Use ice cubes about 1-1.5 inches
- Don't overfill with ice
- Ensure ice is fresh, not freezer-burned

### Step 3: Add Ingredients
- Pour all liquids in order
- Some bartenders pour spirit last (debate exists)
- Don't add too many ingredients (max 5-6)
- Check for any bubbles or foam from pouring

### Step 4: Seal Properly
**For Boston Shaker:**
- Place smaller piece on top at slight angle
- Give one sharp tap with palm
- Should feel secure, not tight
- Test seal before shaking

**For Cobbler Shaker:**
- Screw on tightly
- Add cap to seal
- Ensure tight fit

### Step 5: Shake Vigorously
- **Motion**: Up and down, not circular
- **Intensity**: Hard and fast
- **Duration**: 10-15 seconds
- **Position**: Hold away from body
- **Feel**: Shaker should become very cold

### Step 6: Check Temperature
- Shaker should feel ice-cold to touch
- Metal should be very cold
- No need to shake longer once cold
- If still warm, shake 5 more seconds

### Step 7: Strain Immediately
- Break seal immediately after shaking
- Don't let drink sit in shaker
- Double strain for fruit-based drinks
- Single strain for clear drinks

## The Dry Shake Technique

For cocktails with **egg whites**, use the dry shake method:

### Why Dry Shake?
Egg whites need aeration before dilution. The two-stage process:
1. Creates perfect foam structure
2. Then chills without over-diluting

### Step-by-Step Dry Shake:

**Stage 1: Dry Shake (No Ice)**
1. Add all ingredients except ice
2. Shake vigorously for 10 seconds
3. Creates foam and air incorporation
4. Shaker will feel warm from friction

**Stage 2: Shake with Ice**
1. Remove top, add ice
2. Shake vigorously for 10-15 seconds
3. Cools without breaking down foam
4. Achieves perfect temperature

**Stage 3: Double Strain**
1. Use Hawthorne strainer first
2. Then fine mesh strainer
3. Removes ice chips and pulp
4. Creates silky smooth texture

### When to Use Dry Shake:
- Whiskey Sour (with egg white)
- Pisco Sour
- Ramos Gin Fizz
- Clover Club
- Any egg white cocktail

## Common Shaking Mistakes

### Mistake 1: Under-Shaking
**Problem**: Not shaking long enough
**Result**: Warm drink, poorly integrated ingredients
**Solution**: Shake until shaker is ice-cold (10-15 seconds)

### Mistake 2: Over-Shaking
**Problem**: Shaking too long (30+ seconds)
**Result**: Over-diluted, watery drink
**Solution**: 15 seconds is usually maximum

### Mistake 3: Wrong Ice Size
**Problem**: Ice too small (crushes) or too large (ineffective)
**Result**: Poor shaking or over-crushed ice
**Solution**: Use 1-1.5 inch cubes

### Mistake 4: Circular Motion
**Problem**: Shaking in circular motion
**Result**: Inefficient, doesn't mix properly
**Solution**: Up-and-down motion for maximum turbulence

### Mistake 5: Not Checking Temperature
**Problem**: Shaking by time, not by feel
**Result**: Inconsistent results
**Solution**: Feel the shaker - it should be very cold

### Mistake 6: Shaking Spirit-Forward Drinks
**Problem**: Shaking drinks that should be stirred
**Result**: Destroys clarity and alters texture
**Solution**: Only shake drinks with citrus, dairy, or egg

## Advanced Shaking Techniques

### The Hard Shake
Japanese-influenced technique with more aggressive motion:
- Faster, more vigorous shakes
- Creates more aeration
- Produces frothier texture
- Used in modern craft cocktails

### The Whip Shake
Very short shake with crushed ice:
- 3-5 seconds maximum
- Minimal dilution
- Creates icy texture
- Used for specific cocktail styles

### The Reverse Dry Shake
Start with ice, then remove for dry shake:
1. Shake with ice for 10 seconds
2. Remove ice
3. Dry shake for 10 seconds
4. Creates different foam structure

### The Velvet Shake
Very gentle shaking motion:
- Slower, gentler movement
- Less aeration
- Smooth, refined texture
- Used for certain classic preparations

## Shaking for Different Drink Types

### Shaken Sours (Most Common)
**Examples**: Daiquiri, Whiskey Sour, Sidecar
- Standard hard shake for 10-15 seconds
- Creates perfect integration of citrus
- Results in refreshing, balanced drinks

### Egg White Cocktails
**Examples**: Pisco Sour, Ramos Gin Fizz
- Use dry shake method
- Double strain for silky texture
- Creates beautiful foam cap

### Tropical Cocktails
**Examples**: Piña Colada, Mai Tai
- Shake vigorously for full integration
- May need longer shake for purees
- Double strain for smoothness

### Creamy Cocktails
**Examples**: White Russian, Brandy Alexander
- Shake until fully incorporated
- Ensure no separation
- Creates luxurious texture

## The Science of Shaking

Understanding what happens during shaking:

### Temperature Dynamics
- Ice melts at about 1.5-2 oz per shake
- Water dilutes alcohol from 40% to 25-30%
- Temperature drops to 28-32°F
- Critical for flavor balance

### Aeration Process
- Air bubbles are trapped in liquid
- Creates cloudy, frothy appearance
- Proteins in egg whites trap air
- Results in light, airy texture

### Emulsification
- Fat molecules in dairy get broken down
- Creates stable, creamy mixtures
- Impossible to achieve by stirring
- Essential for cream-based drinks

### Integration
- Different density liquids are forced together
- Polar and non-polar molecules interact
- Creates completely uniform mixture
- Every sip tastes the same

## Timing Your Shake

**General Guidelines:**
- **8-10 seconds**: Light drinks (mostly clear spirits)
- **10-15 seconds**: Standard drinks (citrus cocktails)
- **15-20 seconds**: Creamy drinks or drinks with purees
- **20+ seconds**: Very thick drinks or special preparations

**Signs You've Shaken Enough:**
- Shaker feels ice-cold to touch
- You hear ice breaking but not completely crushed
- Visible condensation on outside
- Shaker "sweating"

**Never Shake:**
- For less than 5 seconds (too cold)
- For more than 25 seconds (over-diluted)
- When you feel the shaker getting warm (should never happen)
- After the ice is completely melted

## Equipment for Perfect Shaking

### Essential Tools
- **Cocktail Shaker**: Boston, Cobbler, or French style
- **Hawthorne Strainer**: Fits over shaker
- **Fine Mesh Strainer**: For double straining
- **Jigger**: For precise measurements
- **Ice Tray**: Make quality ice at home

### Quality Ice
- Use filtered water
- Freeze at least 24 hours
- Don't use old, freezer-burned ice
- Store in airtight container
- Use within a few days

### Optional Enhancements
- **Magnetic Shaker**: For shaking multiple drinks
- **Spring Wand**: For extra froth in egg drinks
- **Shaking Tin Gauge**: For perfect seals

## Practice Makes Perfect

### Daily Practice
Make a drink every day using the shake method. Each time, focus on:
1. Proper ice amount
2. Vigorous motion
3. Temperature check
4. Timing
5. Result quality

### Experiment
Try different shake techniques:
- Fast vs. slow
- Hard vs. gentle
- Short vs. long
- Different ice sizes

### Taste Testing
Compare results:
- Shaken vs. stirred versions
- Different shake times
- Various ice sizes
- Different shaker types

## Troubleshooting Common Issues

### Problem: Drink is Warm
**Cause**: Didn't shake long enough
**Solution**: Shake for full 10-15 seconds, feel for coldness

### Problem: Drink is Watery
**Cause**: Shook too long or used too much ice
**Solution**: Reduce shake time or use larger ice

### Problem: Ingredients Separated
**Cause**: Didn't shake long enough
**Solution**: Shake vigorously for full duration

### Problem: No Foam on Egg Drinks
**Cause**: Didn't use dry shake or shook too long with ice
**Solution**: Use proper dry shake technique

### Problem: Cloudy Drink When It Should Be Clear
**Cause**: Over-shook a spirit-forward drink
**Solution**: Should have stirred instead

## Professional Tips

1. **Hold at 45-degree angle**: Best for ice movement
2. **Use wrist action**: More efficient than arm movement
3. **Practice consistency**: Same motion every time
4. **Clean between drinks**: Rinse shaker immediately
5. **Listen to the ice**: Should hear rattling, not crushing
6. **Feel the rhythm**: Find your cadence and stick to it
7. **Work quickly**: Don't let ice melt before shaking
8. **Double strain always**: For fruit-based drinks
9. **Strain immediately**: Don't let drink sit
10. **Practice regularly**: Muscle memory is key

## Conclusion

Mastering the shake is essential for any serious home bartender or aspiring mixologist. It's not just about combining ingredients - it's about creating the perfect texture, temperature, and integration that transforms a list of ingredients into a complete, harmonious cocktail.

Remember: Shake with confidence and purpose. The best cocktail is made by someone who understands why they're shaking and what effect it's creating. Practice these techniques regularly, experiment with timing and intensity, and soon you'll develop an instinct for the perfect shake for every drink.

The difference between a good cocktail and a great one often comes down to the quality of the shake. Treat it as an art form, respect the technique, and your drinks will reflect that care and attention to detail.`;

    // Update the article with full content
    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 18, // Estimated reading time for full content
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
