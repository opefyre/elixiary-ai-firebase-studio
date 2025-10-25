import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "advanced-muddling-techniques-maximum-flavor";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# Advanced Muddling Techniques for Maximum Flavor

Muddling is the art of gently crushing herbs, fruits, and other ingredients to release their essential oils and flavors into your cocktails. When done correctly, muddling transforms simple ingredients into complex, aromatic elixirs. This comprehensive guide will teach you how to master this fundamental mixology technique.

## What is Muddling?

Muddling is the process of gently pressing and crushing ingredients in the bottom of a mixing glass or cocktail shaker to release their flavors, oils, and juices. Unlike blending or chopping, muddling preserves the structure of ingredients while extracting their essence.

### Why Muddle?
- **Releases Essential Oils**: Breaks down cell walls in herbs and fruits
- **Unlocks Flavors**: Extracts natural sugars and compounds
- **Adds Aroma**: Herb and fruit aromatics enhance the drink
- **Improves Integration**: Helps flavors meld with spirits
- **Creates Texture**: Adds slight pulp and body to drinks

## The Science of Muddling

Understanding what happens during muddling:

### Molecular Breakdown
- **Cell Wall Rupture**: Releases essential oils and juices
- **Oil Extraction**: Citrus peels release aromatic compounds
- **Enzyme Activation**: Bruising activates natural enzymes
- **Flavor Release**: Complex flavor compounds are freed
- **Sugar Extraction**: Natural sugars are released from fruits

### Temperature Effects
- **Cold muddling**: Preserves delicate flavors
- **Warm muddling**: Can cook or wilt ingredients
- **Room temperature**: Best for most herbs
- **Chilled muddler**: Helps maintain temperature

## Essential Muddling Tools

### The Muddler

**Wooden Muddlers** (Most Common):
- Traditional, classic feel
- Provides good control
- Gentle on glass
- Natural material

**Stainless Steel Muddlers**:
- Durable and long-lasting
- Easy to clean
- Professional appearance
- Some have textured ends

**Plastic Muddlers**:
- Affordable option
- Won't scratch glass
- Good for beginners
- Less effective on tough ingredients

### Key Features to Look For:
- **Diameter**: 1-2 inches for surface area
- **Length**: 10-12 inches for control
- **Weight**: Heavy enough for pressure
- **Grip**: Comfortable for extended use
- **End Texture**: Coarse vs. smooth

### Glassware for Muddling

**Best Types:**
- **Heavy-bottomed glass**: Won't crack under pressure
- **Thick-walled**: Protects against breakage
- **Wide base**: More room to work
- **Clear glass**: See what you're doing

## Muddling Techniques by Ingredient

### Herbs: Mint, Basil, Rosemary

**The Mint Muddle** (Most Common):
1. Place 8-10 fresh mint leaves in glass
2. Add simple syrup (optional)
3. Gently press and twist muddler
4. Target: Bruise leaves without tearing
5. Avoid: Over-muddling (creates bitterness)
6. Technique: 3-5 gentle presses should suffice

**Why Gentle?**
- Over-muddling releases chlorophyll (bitter)
- Tearing leaves creates plant debris
- Releases too many tannins
- Can make drink look muddy

**For Basil:**
- Same gentle technique
- Basil is more delicate than mint
- Fewer presses needed
- Releases sweet, aromatic oils

**For Rosemary:**
- Press more firmly (woodier herb)
- Rosemary leaves are tougher
- May need 5-7 presses
- Releases piney, resinous oils

### Citrus Fruits: Lemons, Limes, Oranges

**The Citrus Muddle:**
1. Cut fruit into wedges (usually 1-2 per drink)
2. Place in glass
3. Press firmly but not crushingly
4. Twist muddler to extract juice
5. Aim: Get 1/2 to 3/4 oz juice

**Key Principles:**
- Press firmly enough to break flesh
- Twist to squeeze out juice
- Don't over-muddle (releases pith bitterness)
- Remove seeds after muddling

**Different Citrus:**
- **Lemons**: Medium pressure, watch for seeds
- **Limes**: Similar to lemons, slightly firmer
- **Oranges**: Softer, needs gentler muddling
- **Grapefruit**: Firm but careful with seeds

### Berries: Strawberries, Raspberries, Blackberries

**The Berry Muddle:**
1. Add 3-4 berries to glass
2. Muddle firmly to break skin
3. Mashes fruit into pulp
4. Releases natural sugars
5. Creates fruity, sweet flavor

**Technique:**
- More vigorous than herbs
- Want complete breakdown
- Releases natural pectin
- Adds body and texture

### Hard Fruits: Apples, Pears, Peaches

**The Hard Fruit Muddle:**
1. Cut into small pieces (1/4 to 1/2 inch)
2. Place in glass
3. Firm muddling pressure
4. Break down cellulose fibers
5. Release juices and flavors

**Special Considerations:**
- Softer fruits (peaches) need less pressure
- Harder fruits (apples) need more
- Always remove pits/stones first
- Consider peeling tough skins

### Other Ingredients

**Cucumber:**
- Cut into thick slices
- Gentle muddling
- Releases fresh, watery juice
- Adds cooling effect

**Ginger:**
- Peel first (optional)
- Slice into thin rounds
- Firm pressure needed
- Releases spicy oils
- Can be quite strong

**Chile Peppers:**
- Use with extreme caution
- Very gentle muddling
- Releases capsacin
- Can become overpowering
- Remove seeds to reduce heat

## Step-by-Step Muddling Process

### The Complete Technique

**Step 1: Prep Ingredients**
- Wash all herbs and fruits
- Cut citrus into wedges
- Prepare all ingredients
- Have muddler ready

**Step 2: Add Sweetener First** (Optional)
- Pour simple syrup or sugar
- Creates protective layer
- Prevents over-extraction
- Makes muddling easier

**Step 3: Add Ingredients**
- Place herbs or fruits in glass
- Don't pack too tightly
- Leave room for muddling
- Layer if using multiple items

**Step 4: Begin Muddling**
- Hold muddler vertically
- Press down gently
- Twist wrist slightly
- Apply consistent pressure
- Count presses if needed

**Step 5: Check Progress**
- Look at ingredient breakdown
- Smell the aromatics released
- Check color change
- Stop before over-muddling

**Step 6: Add Remaining Ingredients**
- Pour in spirits
- Add other liquids
- Stir or shake as needed
- Strain if desired

## Common Muddling Mistakes

### Mistake 1: Over-Muddling
**Problem**: Aggressively pounding ingredients
**Result**: Releases bitter compounds, destroys structure
**Solution**: Gentle, controlled presses

### Mistake 2: Wrong Pressure
**Problem**: Too light or too heavy
**Result**: Under-extraction or over-extraction
**Solution**: Find the right pressure for each ingredient

### Mistake 3: Wrong Tool
**Problem**: Using spoon, fork, or other tool
**Result**: Inconsistent results, poor extraction
**Solution**: Always use proper muddler

### Mistake 4: Rushing the Process
**Problem**: Muddling too quickly
**Result**: Incomplete flavor extraction
**Solution**: Take time, muddle properly

### Mistake 5: Not Muddling Enough
**Problem**: Too gentle or too few presses
**Result**: Weak flavor, missing aromatics
**Solution**: Learn proper technique and timing

### Mistake 6: Muddling in Thin Glass
**Problem**: Using fragile glassware
**Result**: Broken glass, dangerous situation
**Solution**: Use heavy-bottomed glass

## Classic Muddled Cocktail Recipes

### Mojito
**The classic muddled cocktail:**

**Ingredients:**
- 10 mint leaves
- 1/2 lime (cut into 4 wedges)
- 2 tsp white sugar
- 2 oz white rum
- Club soda
- Ice

**Muddling:**
1. Muddle mint, lime, and sugar gently
2. 3-5 presses should do it
3. Add rum and ice
4. Top with club soda

### Caipirinha
**Brazil's national cocktail:**

**Ingredients:**
- 1/2 lime (quartered)
- 2 tsp brown sugar
- 2 oz cachaça
- Ice

**Muddling:**
1. Muddle lime and sugar
2. Press firmly to extract juice
3. Add cachaça and ice
4. Stir and serve

### Whiskey Smash
**Modern classic:**

**Ingredients:**
- 6-8 mint leaves
- 1/2 lemon (quartered)
- 1 tsp simple syrup
- 2 oz bourbon
- Ice

**Muddling:**
1. Muddle mint and lemon gently
2. Add syrup and whiskey
3. Shake with ice
4. Strain into glass

### Blackberry Bourbon Smash
**Fruity variation:**

**Ingredients:**
- 5-6 blackberries
- 3-4 mint leaves
- 1/2 lemon (quartered)
- 3/4 oz simple syrup
- 2 oz bourbon
- Ice

**Muddling:**
1. Muddle berries thoroughly
2. Add mint and lemon
3. Muddle gently together
4. Add other ingredients

## Advanced Muddling Techniques

### The Layered Muddle

For complex cocktails with multiple muddled ingredients:

**Technique:**
1. Start with firmest ingredient (berries)
2. Muddle thoroughly
3. Add medium ingredient (citrus)
4. Muddle moderately
5. Add delicate ingredient (herbs)
6. Muddle gently

**Example: Blackberry Basil Gin:**
- Muddle blackberries first (firm)
- Add lemon wedges (medium)
- Add basil leaves (delicate)
- Add gin and ice
- Shake and strain

### The Soft Shake Muddle

Combining muddling with shaking:

**Technique:**
1. Muddle ingredients first
2. Add spirits
3. Shake briefly (soft shake)
4. Double strain
5. Serves

**Why?**
- Maintains muddled texture
- Doesn't over-agitate
- Preserves flavors
- Better mouthfeel

### The Dry Muddle

For certain drink styles:

**Technique:**
1. Muddle without liquid first
2. Extract oils and juices
3. Then add spirits
4. Reduces dilution
5. Concentrates flavors

**When to Use:**
- Very dry cocktails
- Spirit-forward drinks
- When you want maximum flavor
- Minimal dilution desired

## Special Considerations

### Temperature Management

**Cold Muddling:**
- Keeps ingredients fresh
- Preserves delicate aromatics
- Maintains texture
- Best for most cocktails

**Room Temperature Muddling:**
- Allows better oil extraction
- Some ingredients muddle better warm
- Use for specific drink styles
- Experiment to find preference

### Glassware Temperature

**Warm Glass:**
- Can help release oils
- Aids in sugar dissolution
- Use for specific recipes

**Chilled Glass:**
- Preserves freshness
- Standard approach
- Keeps drink colder longer

### Muddling Order

The order matters for layered flavors:

**Recommended Order:**
1. Hard ingredients (berries, fruits)
2. Medium ingredients (citrus)
3. Soft ingredients (herbs, mint)

**Why?**
- Prevents crushing delicate items
- Ensures even extraction
- Best flavor development

## Troubleshooting Common Issues

### Problem: Bitter Flavor
**Cause**: Over-muddling herbs, crushing too many leaves
**Solution**: Use gentler pressure, fewer presses

### Problem: Weak Flavor
**Cause**: Under-muddling, not enough presses
**Solution**: Increase pressure or number of presses

### Problem: Plant Debris in Drink
**Cause**: Muddling too aggressively, using old ingredients
**Solution**: Be gentler, use fresh ingredients, strain

### Problem: Glass Breaking
**Cause**: Too much pressure, wrong glass type
**Solution**: Use heavy glass, moderate pressure

### Problem: Inconsistent Results
**Cause**: Varying pressure or technique
**Solution**: Develop consistent technique, practice

## Maintenance and Care

### Caring for Your Muddler

**Wooden Muddlers:**
- Hand wash only
- Don't soak in water
- Dry thoroughly
- Oil occasionally with food-safe oil
- Replace when splintering

**Stainless Steel Muddlers:**
- Dishwasher safe
- Won't warp or splinter
- Lasts forever
- Easy to sanitize

**Plastic Muddlers:**
- Dishwasher safe top rack
- Replace when worn
- Check for scratches
- Easy to clean

### Keeping Ingredients Fresh

**Herbs:**
- Store in refrigerator
- Keep in water like flowers
- Use within a few days
- Discard wilted leaves

**Citrus:**
- Room temperature is fine
- Use within a week
- Look for bright color
- Feel for firmness

**Berries:**
- Refrigerate promptly
- Use within days
- Check for mold
- Wash before using

## Professional Tips

1. **Buy fresh ingredients**: Quality in, quality out
2. **Invest in a good muddler**: Makes all the difference
3. **Practice consistency**: Same pressure every time
4. **Smell as you muddle**: Learn when extraction is complete
5. **Clean as you go**: Rinse muddler between drinks
6. **Experiment**: Find what works for your style
7. **Respect ingredients**: Gentle touch preserves flavors
8. **Learn from masters**: Watch professional bartenders
9. **Practice daily**: Muscle memory is key
10. **Have fun**: Enjoy the craft

## Conclusion

Mastering muddling elevates your cocktail game from amateur to professional. It's one of the most foundational techniques in mixology, and when done correctly, transforms simple ingredients into extraordinary cocktails.

The key is understanding each ingredient's unique properties and treating them accordingly. Gentle touches for delicate herbs, firm presses for sturdy fruits, and always paying attention to what your senses tell you.

Practice regularly, be patient, and soon you'll develop an instinct for the perfect muddle. The difference between a good cocktail and a great one often comes down to this fundamental technique. Treat muddling as an art form, respect your ingredients, and your drinks will reflect that care and attention to detail.

Remember: When in doubt, muddle more gently than you think. You can always add more pressure, but you can't undo over-muddling. The best cocktails come from understanding the "why" behind every technique, and muddling is no exception.`;

    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 17,
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
