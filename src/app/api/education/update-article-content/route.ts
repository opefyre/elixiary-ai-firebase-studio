import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Find the article by slug
    const articleSlug = "stirring-vs-shaking-when-to-use";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    // Full comprehensive content
    const fullContent = `# Stirring vs. Shaking: When to Use Each Method

Understanding when to stir and when to shake is fundamental to creating perfect cocktails. These two techniques produce dramatically different results, and choosing the wrong method can make or break your drink. This comprehensive guide will teach you when and why to use each technique.

## The Fundamental Difference

The primary distinction between stirring and shaking comes down to what they do to your ingredients:

**Stirring:**
- Gently combines ingredients
- Maintains clarity and transparency
- Produces silky, smooth texture
- Minimal aeration
- Controlled dilution
- Preserves delicate flavors

**Shaking:**
- Vigorously mixes ingredients
- Creates a cloudy, aerated drink
- Produces light, frothy texture
- Significant aeration
- Rapid dilution
- Integrates complex ingredients

## When to Stir: The Classic Method

Stirring is the traditional method for **spirit-forward cocktails** - drinks where the base spirit is the star.

### Always Stir These:
- **Old Fashioned** - Whiskey takes center stage
- **Martini** - Gin or vodka with vermouth
- **Manhattan** - Whiskey, vermouth, and bitters
- **Negroni** - Equal parts gin, Campari, vermouth
- **Vieux Carré** - Complex rye and cognac blend
- **Boulevardier** - Bourbon-based Negroni variation

### Why Stir These?
1. **Preserves Clarity**: You want to see the beautiful color of your spirit
2. **Maintains Texture**: Spirit-forward drinks should feel silky, not frothy
3. **Respects the Spirit**: Allows the base spirit's character to shine
4. **Smooth Integration**: Gently melds flavors without overwhelming
5. **Professional Presentation**: Clear, elegant drinks look more sophisticated

### The Stirring Technique

**Proper stirring is an art:**
1. Fill mixing glass 2/3 with ice
2. Add all ingredients
3. Insert bar spoon, touch bottom
4. Stir smoothly 20-30 times (clockwise is traditional)
5. Feel the mixing glass chill
6. Strain into chilled glass
7. Strain carefully to avoid splashing

**Key Points:**
- Stir for 20-30 seconds
- Mixing glass should feel very cold
- No vigorous motion - smooth and steady
- Feel the chill, don't count time
- Ice should be large and dense

## When to Shake: The Energetic Method

Shaking is essential for cocktails containing **citrus juice, dairy, egg whites, or syrups**.

### Always Shake These:
- **Daiquiri** - Contains lime juice
- **Whiskey Sour** - Lemon juice and often egg white
- **Margarita** - Fresh lime juice
- **Tom Collins** - Lemon juice component
- **Sidecar** - Lemon juice
- **Cosmopolitan** - Cranberry and lime juice
- **Pisco Sour** - Egg white and lime
- **Any drink with fresh citrus**

### Why Shake These?
1. **Integrates Juices**: Thoroughly mixes liquids of different densities
2. **Incorporates Air**: Creates frothy texture in sour drinks
3. **Breaks Down Egg Whites**: Makes egg-based drinks silky smooth
4. **Chills Rapidly**: Cold drinks with citrus taste better
5. **Professional Froth**: Creates attractive foam on top
6. **Dilution Control**: Proper shaking creates perfect balance

### The Shaking Technique

**Master this method:**
1. Fill shaker 2/3 with ice
2. Add all ingredients
3. Cap shaker securely
4. Shake vigorously for 10-15 seconds
5. Shaker should feel ice-cold
6. Strain into glass (double strain if needed)

**Key Points:**
- Shake hard and fast
- Use ice that's not too large or small
- Shake until shaker is very cold
- Listen for ice rattling
- Don't over-shake (15 seconds is plenty)

## The Dry Shake Technique

For cocktails with **egg whites**, use the dry shake:

1. **First shake**: Without ice - "dry shake" for 10 seconds
2. **Add ice**: Open shaker, add ice
3. **Second shake**: With ice for 10 more seconds
4. **Strain**: Double strain for smooth texture

**When to Use:**
- Whiskey Sour with egg white
- Pisco Sour
- Ramos Gin Fizz
- Clover Club

## Common Mistakes to Avoid

### Mistake 1: Shaking Spirit-Forward Drinks
**Wrong**: Shaking a Martini or Old Fashioned
**Why**: Destroys the clarity and changes the texture
**Result**: Cloudy, diluted, less aromatic drink

### Mistake 2: Stirring Citrus Cocktails
**Wrong**: Stirring a Margarita or Daiquiri
**Why**: Won't integrate juice properly
**Result**: Separated ingredients, lackluster texture

### Mistake 3: Under-Shaking
**Wrong**: Shaking for only 3-5 seconds
**Why**: Won't properly chill or integrate
**Result**: Warm drink, weak flavor integration

### Mistake 4: Over-Shaking
**Wrong**: Shaking for 30+ seconds
**Why**: Over-dilutes and can melt flavors
**Result**: Watery, overly diluted drink

### Mistake 5: Wrong Ice
**Wrong**: Using small ice for stirring
**Why**: Melts too fast
**Result**: Over-diluted drink

## The Science Behind It

Understanding the "why" helps you remember:

**Surface Area**: Shaking dramatically increases surface area between liquid and ice, speeding dilution and cooling.

**Oxygenation**: Shaking introduces oxygen, creating small bubbles and changing texture.

**Emulsification**: Vigorous shaking helps emulsify fat (in egg whites) and integrate otherwise immiscible liquids.

**Turbulence**: The violent motion breaks down ingredients and creates froth, especially with proteins.

## Making the Right Choice: Quick Reference

Choose **STIR** if:
- ✅ No citrus juice
- ✅ No dairy or egg
- ✅ Spirit-forward drink
- ✅ Want clear, transparent drink
- ✅ Want silky, smooth texture
- ✅ Traditional recipe calls for it

Choose **SHAKE** if:
- ✅ Contains citrus juice (lemon, lime)
- ✅ Contains egg white or dairy
- ✅ Has syrups or thick ingredients
- ✅ Want frothy, aerated texture
- ✅ Need vigorous integration
- ✅ Recipe specifically calls for shaking

## Famous Disagreements

Even experts disagree on some drinks:

**The Martini Controversy:**
- James Bond prefers his "shaken, not stirred"
- Classicists insist it must be stirred
- Many bartenders consider shaken Martini heresy

**The Margarita Debate:**
- Most agree it should be shaken
- Some purists prefer a stirred approach for tequila-forward versions

**The Sour Question:**
- Most sours are shaken
- Some modern recipes use stirring for unique texture

## Practical Experiment

Try this experiment to taste the difference:

**Make two Manhattans:**

**Stirred Manhattan:**
- 2 oz rye whiskey
- 1 oz sweet vermouth
- 2 dashes Angostura bitters
- Stir with ice, strain

**Shaken Manhattan:**
- Same ingredients
- Shake with ice, strain

**Compare:**
- Color (stirred is clear, shaken is cloudy)
- Texture (stirred is silky, shaken is frothy)
- Aroma (stirred preserves whiskey, shaken alters it)
- Flavor (stirred is bold, shaken is diluted)

## Advanced Techniques

**Modified Shake:**
- Hard shake for 10 seconds, then soft roll
- Creates middle ground texture

**Reverse Dry Shake:**
- Shake with ice first
- Then dry shake without ice
- For different foam structure

**Whip Shake:**
- Very short shake with crushed ice
- For minimal dilution but good integration

## Conclusion

The choice between stirring and shaking fundamentally changes your cocktail. Stir for clarity and elegance in spirit-forward drinks. Shake for integration and froth when using citrus, dairy, or eggs. Master both techniques, and you'll create better cocktails every time.

**Remember**: When in doubt, follow the recipe. When experimenting, ask yourself: does this drink have citrus or egg? If yes, shake. If no, stir. The art is in understanding why each method works for different drinks.

Practice both techniques until they feel natural. The best cocktails come from understanding the "why" behind every technique.`;

    // Update the article with full content
    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 15, // Estimated reading time for full content
      updatedAt: new Date(),
      // Enhanced metadata
      wordCount: fullContent.split(/\s+/).length,
      lastReviewed: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Article updated with full content successfully",
      articleId: articleId,
      wordCount: fullContent.split(/\s+/).length
    });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
