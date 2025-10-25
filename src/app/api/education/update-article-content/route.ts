import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "precision-measurements-importance-jiggers";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# Precision Measurements: The Importance of Jiggers

In the world of professional mixology, precision is everything. While eye-balling measurements might seem convenient, it's the quickest way to ruin a perfectly good cocktail recipe. This is where the humble jigger comes in - the most essential tool for any serious home bartender or aspiring mixologist. This comprehensive guide will teach you why jiggers matter and how to use them like a pro.

## Why Precision Matters in Cocktail Making

Understanding the science behind cocktail measurements is crucial to appreciating why jiggers are indispensable.

### The Ratio Game

**Cocktails are All About Ratios:**
- Each cocktail recipe is a carefully balanced equation
- Small changes in ratios dramatically alter flavor
- One extra quarter-ounce can completely throw off balance
- Precision ensures consistency in every drink

**Real-World Impact:**
- Too much spirit = overwhelming alcohol taste
- Too little sweetener = harsh, unbalanced drink
- Wrong citrus amount = too tart or too flat
- Imprecise dilution = inconsistent results

### Professional Standards

**Why Bars Insist on Jiggers:**
- Quality control across all bartenders
- Cost control for the business
- Consistency for repeat customers
- Speed and efficiency in service
- Reproducibility of signature drinks

### The Home Bar Benefit

**Why You Should Use Jiggers Too:**
- Understand recipes correctly
- Recreate drinks you love
- Learn proper technique
- Build real cocktail skills
- Impress your guests

## Understanding Jigger Measurements

### Standard Volume Measurements

**The Imperial System (US):**
- 1 fluid ounce (oz) = 30 ml
- 1/2 oz = 15 ml
- 3/4 oz = 22.5 ml
- 1-1/2 oz = 45 ml
- 2 oz = 60 ml

**The Metric System:**
- Most cocktail jiggers show ml
- Easier to work with decimals
- More precise for small measurements
- International standard

### Common Jigger Configurations

**The Classic Japanese Jigger:**
- 1 oz / 30 ml (top)
- 2 oz / 60 ml (bottom)
- Most versatile configuration
- Professional standard

**The European Double-Ended:**
- 1 oz / 30 ml (one side)
- 1-1/2 oz / 45 ml (other side)
- Good for highballs and long drinks
- Common in UK and Europe

**The Measurements Jigger:**
- Multiple measurements on each side
- Very precise with hash marks
- Good for beginners
- Shows exact measurements

**The Teaspoon Jigger:**
- Designed for bitters and dashes
- Very small measurements
- Essential for precision work
- Professional tool

## Types of Jiggers

### Japanese-Style Jigger

**Characteristics:**
- Double-ended design
- Sharp corners for precise pours
- Heavy stainless steel construction
- Professional-grade precision
- Japanese craftsmanship

**Best For:**
- Professional bartending
- Precise measurements
- Consistency
- Japanese cocktail techniques

**Why Professionals Love It:**
- Accuracy is unmatched
- Easy to handle quickly
- Durable and long-lasting
- Can be held in hand during pours

### European-Style Jigger

**Characteristics:**
- Rounded measurements
- Often includes multiple sizes
- Can have hourglass shape
- Sometimes includes different metals

**Best For:**
- Classic cocktails
- Home bartending
- Those who prefer rounded design
- Traditional mixology

### Measurement Jigger

**Characteristics:**
- Has hash marks for precise measurements
- Shows fractions and percentages
- Can be transparent
- Good for learning

**Best For:**
- Beginners learning measurements
- Understanding ratios
- Educational purposes
- Home experimentation

### Oxo-Style Jigger

**Characteristics:**
- Angled design for easy reading
- Comfortable to hold
- Good pour spout
- Modern design

**Best For:**
- Home bartenders
- Easy-to-use design
- Measuring while pouring
- Kitchen-to-bar crossover

## How to Use a Jigger Properly

### The Technique

**Step 1: Choose Your Side**
- Determine which measurement you need
- Use larger side for base spirit
- Use smaller side for modifiers
- Check before pouring

**Step 2: Pour to the Rim**
- Fill to absolute top
- No meniscus or curve
- Full to the edge
- Inconsistent measurements ruin cocktails

**Step 3: Hold Properly**
- Grip jigger firmly but comfortably
- Keep it level when measuring
- Don't tilt while filling
- Practice control

**Step 4: Pour into Mixing Vessel**
- Pour smoothly and steadily
- Control the stream
- Don't splash or drip
- Professional presentation

### Common Mistakes to Avoid

**Mistake 1: Under-Filling**
**Problem**: Not filling to absolute top
**Result**: Less alcohol than recipe calls for
**Solution**: Always fill completely to rim

**Mistake 2: Over-Filling**
**Problem**: Contents above the rim
**Result**: Too much of ingredient
**Solution**: Pour exactly to rim, no overflow

**Mistake 3: Using Wrong Side**
**Problem**: Confusion about which side is which
**Result**: Completely wrong measurements
**Solution**: Practice identifying your jigger's sizes

**Mistake 4: Tilting While Pouring**
**Problem**: Not holding jigger level
**Result**: Inaccurate measurements
**Solution**: Keep jigger perfectly horizontal

**Mistake 5: Rushing**
**Problem**: Trying to speed up measuring
**Result**: Inaccurate pours and spills
**Solution**: Take your time, precision over speed

### Speed vs. Accuracy

**The Professional Balance:**
- Start slow and accurate
- Build muscle memory
- Speed comes with practice
- Never sacrifice accuracy for speed
- Pros are fast because they're accurate

**Learning Progression:**
1. Master accuracy first
2. Learn proper technique
3. Build consistency
4. Increase speed gradually
5. Maintain accuracy at speed

## Advanced Jigger Techniques

### The Japanese Jigger Method

**Two-Jigger Technique:**
- Hold one jigger between fingers
- Use other hand for bottle
- Measure while holding jigger
- Pour directly into mixing vessel
- Extremely efficient for busy bar

**Benefits:**
- Faster than using same jigger repeatedly
- Professional technique
- Impresses guests
- Shows real skill

**How to Master:**
- Start with one jigger first
- Add second jigger gradually
- Practice empty pours
- Build muscle memory

### Free-Pouring Training

**Advanced Technique:**
- Counting seconds = measurements
- Requires extensive practice
- Professional bartender skill
- Not recommended for beginners

**Learning Free Pour:**
- Start with jigger timing
- Count 1-2-3-4 for 1 oz
- Practice until consistent
- Verify with jigger always
- Years of practice needed

**Professional Use:**
- Only after mastering jiggers
- Some high-volume bars
- Speed competitions
- Advanced skill level

### Multiple Measurements

**Using Jigger for Thirds:**
- Fill jigger 1/3, 2/3, or full
- Requires practice to estimate
- More challenging but useful
- Good for specific recipes

**Eye-Balling Fractions:**
- For experienced users
- Requires visual calibration
- Always verify with proper fill
- Not for beginners

## Jigger Size Guide

### Choosing the Right Jigger

**For Classic Cocktails:**
- Use 1 oz / 2 oz jigger
- Most recipes call for these sizes
- Covers majority of cocktails
- Essential starting point

**For Tiki Drinks:**
- May need larger jigger
- Some recipes call for 3-4 oz pours
- Long drinks need more volume
- Adjust equipment accordingly

**For Precision Cocktails:**
- Japanese-style preferred
- Exact measurements critical
- No room for error
- Professional results

**For Beginners:**
- Start with dual-sided jigger
- 1 oz / 2 oz is perfect
- Learn measurements first
- Upgrade later as needed

### Build Your Collection

**Essential Jiggers:**
1. **Primary Jigger** (1 oz / 2 oz) - Must have
2. **Teaspoon Jigger** - For bitters and small measures
3. **Larger Jigger** - For long drinks if needed

**Optional Additions:**
- Different metals (copper, etc.)
- Decorative jiggers
- Specialized sizes
- Collector's pieces

## Taking Care of Your Jiggers

### Cleaning and Storage

**Daily Care:**
- Wash after each use
- Dry immediately
- Don't leave in water
- Keep clean

**Deep Cleaning:**
- Remove any residue
- Polish stainless steel
- Check for scratches
- Maintain appearance

**Storage:**
- Keep in dry place
- Avoid denting
- Store upright
- Protect from damage

### When to Replace

**Signs It's Time:**
- Rust or corrosion
- Dents that affect pouring
- Loss of precision markings
- Overall wear and tear

**Quality Lasts:**
- Good jiggers last years
- Worth investing in quality
- Professional tools are durable
- Treat them well

## Common Recipes Using Jiggers

### Classic Cocktails for Practice

**Old Fashioned:**
- 2 oz bourbon
- 1/4 oz simple syrup
- 2-3 dashes bitters
- Practice measuring each exactly

**Manhattan:**
- 2 oz rye whiskey
- 1 oz sweet vermouth
- 2 dashes bitters
- Perfect for practicing 2:1 ratio

**Martini:**
- 2 oz gin or vodka
- 1 oz dry vermouth (or less)
- Learn to adjust ratios
- Precision matters most here

**Daiquiri:**
- 2 oz rum
- 3/4 oz lime juice
- 3/4 oz simple syrup
- Practice with smaller measurements

### Learning Through Recipes

**Why Practice with Cocktails:**
- See how ratios affect taste
- Understand why precision matters
- Learn to adjust recipes
- Build confidence in measurements

**The Repeatability Test:**
- Make same cocktail multiple times
- With jigger - should taste identical
- Without jigger - varies each time
- Demonstrates jigger importance

## Myths About Jiggers

### "Real bartenders don't use jiggers"

**The Reality:**
- Top professionals always use jiggers
- Michelin-star bars require jiggers
- Competition winners use jiggers
- Only in very specific contexts might they free-pour

**The Truth:**
- Jiggers show professionalism
- Accuracy is valued by serious bartenders
- Customers appreciate consistency
- Speed comes with accuracy, not by skipping jiggers

### "Eye-balling is close enough"

**Why This Fails:**
- Even small variations matter
- Your eye is not accurate
- Repeatability suffers
- Professional results require jiggers

**The Test:**
- Make cocktail with jigger
- Then without jigger
- Taste them side by side
- Noticeable difference

### "It slows you down"

**The Reality:**
- Only slows down beginners
- Professionals are fast with jiggers
- Speed comes from practice
- Accuracy first, speed second

**Muscle Memory:**
- With practice, jigger becomes natural
- No conscious thought needed
- Actually speeds up in long run
- Built-in precision

## Choosing Your First Jigger

### What to Look For

**Essential Features:**
- Dual-sided design
- Clear measurement marks
- Comfortable to hold
- Good balance
- Appropriate size

**Material Considerations:**
- Stainless steel (most common)
- Durable and easy to clean
- Won't react with ingredients
- Professional appearance

**Size Considerations:**
- 1 oz / 2 oz is standard
- Start with this size
- Add other sizes later
- Don't buy too small or too large

### Recommended Brands

**For Beginners:**
- OXO Good Grips
- Affordable and reliable
- Easy to read measurements
- Good pour spouts

**For Serious Hobbyists:**
- Cocktail Kingdom Japanese jiggers
- Professional quality
- Precise measurements
- Industry standard

**Budget Options:**
- Check restaurant supply stores
- Online marketplaces
- Simple is often best
- Avoid gimmicks

## Practice Drills

### The Precision Challenge

**Drill 1: One Ounce Challenge**
- Measure 1 oz of water
- Pour into measuring cup
- Check accuracy
- Repeat until perfect

**Drill 2: Speed Challenge**
- Measure 1, 1.5, 2 oz quickly
- No mistakes allowed
- Time yourself
- Improve each session

**Drill 3: Alternating Sides**
- Switch between jigger sides
- No hesitation
- Correct side every time
- Build muscle memory

### Consistency Tests

**Making the Same Cocktail:**
- Make same drink 5 times
- Try to make them identical
- Use jigger each time
- Taste and compare

**Your Results:**
- With jigger: Should be identical
- Without jigger: Will vary
- Proves jigger importance
- Builds confidence

## Troubleshooting Common Issues

### "I can't get exact measurements"

**Possible Causes:**
- Not filling to rim
- Tilting jigger
- Wrong side
- Poor jigger quality

**Solutions:**
- Slow down and be deliberate
- Check your technique
- Use quality jigger
- Practice regularly

### "It's too slow with a jigger"

**Why It Feels Slow:**
- You're new to technique
- Not muscle memory yet
- Being too careful
- Afraid of mistakes

**How to Get Faster:**
- Practice daily
- Build muscle memory
- Don't rush accuracy
- Speed will come naturally

### "Measurements seem inconsistent"

**Diagnosing the Problem:**
- Check jigger quality
- Review your technique
- Are you using right side?
- Filling all the way?

**Getting Back on Track:**
- Start over carefully
- Measure exact to rim
- Slow and deliberate
- Build consistency again

## Conclusion

Mastering the jigger is fundamental to becoming a skilled mixologist. It's not about the tool itself, but about understanding that precision creates excellence. Whether you're crafting cocktails for yourself or entertaining guests, using a jigger demonstrates respect for the craft and commitment to quality.

**Key Takeaways:**
- Precision is non-negotiable for great cocktails
- Jiggers ensure consistency and repeatability
- Professional technique requires practice
- Quality tools matter for quality results
- Speed follows accuracy, not the other way around

**Remember**: Every master bartender started where you are. They learned that using a jigger isn't a crutch - it's a requirement. The difference between a good cocktail and a great cocktail often comes down to those precise measurements. So grab your jigger, practice your technique, and embark on a journey toward mixology mastery.

The jigger is your gateway to understanding cocktail chemistry, building real bartending skills, and creating drinks that consistently impress. Treat it with respect, master its use, and let it be the foundation of your cocktail-making excellence. Cheers to precision and perfect cocktails!`;

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
