import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "professional-layering-techniques-stunning-cocktails";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# Professional Layering Techniques for Stunning Cocktails

Creating layered cocktails is one of the most visually impressive techniques in mixology. These stunning drinks showcase separate layers of different colors and densities, creating a beautiful gradient effect that's as much art as it is cocktail. This comprehensive guide will teach you how to master the craft of layering.

## What is Layering?

Layering is the technique of carefully pouring ingredients of different densities on top of one another, creating distinct, separate layers that don't mix. The result is a visually striking drink with multiple horizontal bands of color.

### Why Layer?
- **Visual Appeal**: Creates stunning, Instagram-worthy drinks
- **Separate Flavors**: Each layer can have distinct flavors
- **Presentation**: Demonstrates technical skill and artistry
- **Theatrical Effect**: Impresses guests and customers
- **Unique Experience**: Different tastes as you drink through layers

## The Science of Density

Understanding density is the key to successful layering:

### How It Works
- **Heavier liquids sink**: Higher density (specific gravity)
- **Lighter liquids float**: Lower density (specific gravity)
- **Proper order matters**: Must pour from heaviest to lightest
- **Sugar content affects weight**: Sweeter = heavier
- **Alcohol content affects weight**: Higher proof = lighter

### Density Comparison (Heavy to Light)
1. **Heavy syrups** (grenadine, orgeat) - ~1.2 g/ml
2. **Cream and liqueurs** - ~1.1-1.15 g/ml
3. **Juices and sodas** - ~1.0-1.05 g/ml
4. **Spirits** (whiskey, gin) - ~0.95 g/ml
5. **Light spirits** (high-proof vodka) - ~0.9 g/ml

## Essential Tools for Layering

### Must-Have Tools
- **Bar Spoon**: Long-handled, with twisted stem
- **Measuring Tools**: Jigger for precise amounts
- **Layered Glass**: Tall, clear, preferably Pilsner or Collins glass
- **Steady Hand**: Practice and patience required
- **Proper Lighting**: To see layers forming

### Optional Enhancements
- **Pouring Spout**: Helps control flow
- **Strainer**: For perfect stream control
- **Funnel**: For very precise layering
- **Straw**: For testing layer separation

## Mastering the Pouring Technique

### The Basic Method: Float on Spoon

This is the most common and reliable technique:

**Step 1: Prepare Layers in Order**
- Arrange ingredients from heaviest to lightest
- Measure each layer precisely (usually 0.5-1 oz each)
- Have everything ready before starting

**Step 2: Pour Base Layer**
- Pour the heaviest ingredient directly into glass
- Fill to desired first layer level
- This becomes your foundation

**Step 3: Invert Spoon**
- Place bar spoon upside down, touching inside of glass
- Spoon should rest against the glass at slight angle
- Bowl of spoon should face upward (inverted)

**Step 4: Pour Onto Spoon**
- Pour next layer directly onto the spoon
- Liquid should flow over spoon onto previous layer
- Spoon disperses the liquid gently
- Pour slowly and steadily

**Step 5: Let It Flow**
- Liquid should flow down spoon and spread smoothly
- Watch as it settles on top of previous layer
- Don't rush - steady and controlled

**Step 6: Repeat Process**
- Continue with each successive layer
- Maintain same angle and technique
- Keep spoon position consistent

### Alternative Technique: Back of Spoon

Similar method but with spoon held differently:

1. Place spoon face down inside glass
2. Spoon should be almost horizontal
3. Pour onto back of spoon
4. Liquid flows over edges onto layer below
5. Very gentle dispersion

### Advanced Technique: Side Pour

For experienced layering:

1. Hold spoon against side of glass
2. Pour down glass wall first
3. Spoon catches and directs flow
4. Requires more practice
5. Results in cleaner layers

## Popular Layered Cocktail Recipes

### B-52 Shot
**One of the most famous layered drinks:**

**Layers (bottom to top):**
1. **Kahlúa** (coffee liqueur) - 1/3
2. **Baileys Irish Cream** - 1/3
3. **Grand Marnier** - 1/3

**Technique**: Use bar spoon for each layer, pour very slowly

### Pousse Café
**French classic:**

**Layers (bottom to top):**
1. Red - Grenadine
2. Orange - Orange liqueur
3. Yellow - Yellow Chartreuse
4. Green - Green Chartreuse
5. Blue - Crème de Menthe

### Rainbow Shot
**Multi-colored marvel:**

**Layers:**
1. Grenadine (red)
2. Orange juice (orange)
3. Blue Curaçao (blue)
4. Green Curaçao (green)
5. Top with vodka (clear)

### Flaming Dr. Pepper
**Layered with a twist:**

**Layers:**
1. Amaretto (bottom)
2. Beer (top)
3. Add flaming 151 rum floater
4. Extinguish and drink in one gulp

### Rising Sun
**Beautiful gradient:**

**Layers:**
1. Red - Grenadine
2. Orange - Orange juice
3. Yellow - Pineapple juice
4. Top with light rum

## Tips for Perfect Layering

### Temperature Matters
- **Use room temperature ingredients**: Temperature affects density
- **Avoid ice until layering is done**: Ice changes density
- **Cold can cause condensation**: Affects pour control

### Pour Speed is Critical
- **Too fast**: Layers mix and blend
- **Too slow**: Can cause mixing during slow pour
- **Just right**: Steady, moderate speed works best
- **Practice makes perfect**: Each ingredient needs different speed

### Glass Selection
- **Tall and narrow**: Better for layers
- **Clear glass**: Must see what you're doing
- **Straight sides**: Helpful for neat layers
- **Stemmed optional**: Easier to hold during layering

### Order of Operations
1. Measure all ingredients first
2. Arrange from heaviest to lightest
3. Pour in proper sequence
4. Never skip ahead
5. Take your time

## Common Layering Mistakes

### Mistake 1: Wrong Pour Order
**Problem**: Pouring light before heavy
**Result**: Layers invert or mix completely
**Solution**: Always start with heaviest

### Mistake 2: Pouring Too Fast
**Problem**: Aggressive, fast pouring
**Result**: Layers mix together
**Solution**: Slow, steady, controlled pour

### Mistake 3: Skipping the Spoon
**Problem**: Pouring directly onto layer
**Result**: Liquid punches through layer
**Solution**: Always use spoon to disperse

### Mistake 4: Wrong Spoon Angle
**Problem**: Spoon not properly positioned
**Result**: Liquid doesn't flow smoothly
**Solution**: Invert spoon, adjust angle

### Mistake 5: Using Cold Ingredients
**Problem**: Different temperatures affect density
**Result**: Layers don't separate properly
**Solution**: Use room temperature ingredients

### Mistake 6: Disturbing After Layering
**Problem**: Moving or jostling layered drink
**Result**: Layers mix together
**Solution**: Handle very carefully once layered

## Density Testing

### How to Test Density
Before attempting a complex layered drink:

**Simple Test Method:**
1. Take small samples of each ingredient
2. Pour small amounts into test glass
3. Observe which floats on which
4. Note the order from bottom to top
5. Use this as your pouring order

### Creating Custom Layers
To create your own layered cocktail:

1. **Test each ingredient**: Measure density
2. **Arrange by weight**: Heaviest to lightest
3. **Practice separately**: Master each layer
4. **Combine carefully**: Take your time
5. **Adjust as needed**: Modify amounts

### Adjusting Density
Sometimes you need to adjust ingredient density:

**To Make Heavier (more dense):**
- Add sugar or syrup
- Use cream or dairy
- Add liqueur with high sugar

**To Make Lighter (less dense):**
- Dilute with water
- Use higher proof spirit
- Reduce sugar content

## Advanced Layering Techniques

### Creating Gradients
For smooth color transitions:

1. Start with two similar densities
2. Pour very slowly
3. Allow slight mixing at border
4. Creates gradual transition
5. More sophisticated effect

### Floating Luxardo Cherry
Adding garnish to layered drinks:

1. Complete all layers
2. Carefully add garnish
3. Use long cocktail pick
4. Cherry or olive works well
5. Balance carefully on top

### Multi-Color Layers
Creating 4+ layer drinks:

1. Must know exact density order
2. Each layer must be distinct
3. Practice simpler versions first
4. Use small amounts (0.25-0.5 oz each)
5. Test layers separately before combining

### Layered Shooters vs. Cocktails
**Shooters:**
- Smaller amounts
- Usually 3-4 layers maximum
- Drunk quickly
- Simpler density variations

**Cocktails:**
- Larger servings
- Can have more layers
- Meant to be sipped
- More complex density balancing

## Troubleshooting Common Problems

### Problem: Layers Mixing
**Causes**: Pouring too fast, wrong density order, incorrect technique
**Solutions**: Slow down, recheck densities, use proper spoon technique

### Problem: Layers Won't Float
**Causes**: Density too similar, wrong pouring order
**Solutions**: Adjust density, pour in correct order

### Problem: Uneven Layers
**Causes**: Unsteady hand, inconsistent pouring
**Solutions**: Support arm, practice steady pouring

### Problem: Glass Overflow
**Causes**: Too much liquid per layer
**Solutions**: Reduce each layer amount, use proper glass size

### Problem: Opaque Layers
**Causes**: Using cloudy ingredients
**Solutions**: Use clearer liquids, strain ingredients

## Equipment Care and Maintenance

### Keeping Tools Clean
- Rinse bar spoon immediately after use
- Clean between different drinks
- Store spoon properly to maintain shape
- Check for bends or damage

### Glass Preparation
- Use clean, dry glasses
- Warm glasses slightly for better flow
- Avoid dishwasher soap residue
- Polish for best visibility

## Professional Presentation Tips

### Serving Layered Cocktails
1. **Handle carefully**: Don't disturb layers
2. **Present immediately**: Layers can settle
3. **Use clear glassware**: Show off the layers
4. **Add garnish carefully**: Don't disrupt layers
5. **Provide straw**: Guest can stir if desired

### Photography Tips
For Instagram-worthy shots:

1. **Natural light**: Shows true colors
2. **Back lighting**: Creates glow effect
3. **Side angle**: Shows all layers
4. **Clean background**: No distractions
5. **Fresh ice**: Add ice just before photo

## Common Layered Cocktail Variations

### Tequila Sunrise
- Orange juice base
- Tequila float
- Grenadine sink
- Classic gradient effect

### Slippery Nipple
- Bailey's bottom
- Sambuca top
- Simple two-layer shot

### Sake Bomb
- Beer bottom
- Sake top
- Drink in one gulp

### Mind Eraser
- Kahlúa bottom
- Coffee liqueur middle
- Soda top
- Stir before drinking

## Conclusion

Mastering layering techniques elevates your cocktail game to professional levels. While it requires patience and practice, the visual impact and impressive presentation make it worth the effort.

**Remember**: Start simple with 2-3 layer drinks and work your way up. Understanding density is fundamental - test your ingredients before attempting complex layered cocktails. The key is patience, steady hands, and proper pouring technique using your bar spoon.

Practice regularly, experiment with different ingredient combinations, and soon you'll be creating stunning layered cocktails that look as good as they taste. The art of layering is about precision and patience - master these, and you'll create drinks that impress every time.`;

    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 16,
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
