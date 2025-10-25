import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "double-strain-technique-perfect-cocktails";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# The Double Strain Technique for Perfect Cocktails

The double strain is one of the most underrated yet essential techniques in professional bartending. While it might seem like an extra step, this simple method transforms cocktails from good to exceptional by ensuring silk-smooth texture, eliminating unwanted ice chips, and creating that luxurious mouthfeel that separates amateur drinks from professional craftsmanship.

## What is Double Straining?

### The Two-Layer System

**How It Works:**
- First strain: Hawthorne strainer to catch large ice and citrus
- Second strain: Fine mesh sieve to catch tiny ice chips and pulp
- Result: Crystal-clear, smooth cocktail
- Professional finishing touch
- Essential for premium cocktails

**The Process:**
- Strain from shaker through Hawthorne strainer
- Immediately strain again through fine mesh sieve
- Pour into chilled serving glass
- Enjoy perfectly smooth texture
- Professional presentation every time

### Why It Matters

**Texture Improvement:**
- Eliminates ice shards completely
- Removes citrus pulp and seeds
- Creates silky, smooth mouthfeel
- Prevents ice chips from melting and diluting
- Professional-grade consistency

**Presentation Quality:**
- Crystal-clear cocktails
- No visible debris or ice
- Clean, professional appearance
- Elevates the entire experience
- Shows attention to detail

## When to Double Strain

### Always Double Strain

**Shaken Cocktails:**
- All shaken cocktails benefit
- Ice breaks into smaller pieces during shaking
- Especially important for egg white drinks
- Daiquiris, Whiskey Sours, etc.
- Creates smooth, creamy texture

**Citrus-Heavy Drinks:**
- Juiced cocktails have pulp
- Pineapple and other fruits have fiber
- Seeds can sneak through
- Ensures clear, clean drink
- Professional standard

### When Single Strain is Enough

**Stirred Cocktails:**
- Usually only need single strain
- Ice stays more intact
- Less risk of ice chips
- But fine mesh still improves
- Professional choice

**Simple Spirits:**
- Neat spirits don't need straining
- But if mixed and iced, consider it
- Quality always matters
- Worth the extra effort
- Professional attention

## Essential Equipment

### Hawthorne Strainer

**Function:**
- Primary filtering layer
- Coils catch large ice pieces
- Handles shaker opening
- Quick first pass filtration
- Essential first step

**Features:**
- Spring coils for flexibility
- Handle for control
- Fits various shaker sizes
- Durable construction
- Professional quality

### Fine Mesh Strainer

**Critical Second Layer:**
- Very fine mesh (60-100 wires per inch)
- Catches smallest ice chips
- Removes citrus pulp
- Filters out any sediment
- Final refinement

**Selection Tips:**
- Choose quality materials
- Ensure fine enough mesh
- Comfortable handle grip
- Easy to clean
- Durable construction

### Tools Summary

**Basic Setup:**
- Hawthorne strainer
- Fine mesh sieve
- That's it for essentials
- Both relatively affordable
- Worth investment

**Quality Matters:**
- Better tools last longer
- Perform more consistently
- Easier to clean and maintain
- Professional results
- Worth spending more

## The Technique: How to Double Strain

### Step-by-Step Process

**Step 1: Prepare Your Strainer**
- Hold fine mesh sieve over glass
- Position Hawthorne strainer in other hand
- Ready for pouring
- Quick and efficient setup

**Step 2: First Strain (Hawthorne)**
- Remove shaker lid
- Place Hawthorne strainer on shaker
- Pour through into fine mesh sieve
- Catch large ice and citrus
- First filtration layer

**Step 3: Second Strain (Fine Mesh)**
- Liquid catches in fine mesh
- Small ice chips trapped
- Citrus pulp removed
- Crystal-clear cocktail results
- Final polishing step

**Step 4: Serve**
- Pour into prepared glass
- Enjoy professional-quality texture
- Notice the smoothness
- Appreciate the clarity
- Professional finish

### Common Mistakes to Avoid

**Mistake 1: Skipping Second Strain**
- Problem: Ice chips in drink
- Result: Chunks of ice dilute drink over time
- Solution: Always use fine mesh

**Mistake 2: Wrong Order**
- Problem: Straining through fine mesh first
- Result: Clogs easier, less efficient
- Solution: Always Hawthorne first, then fine mesh

**Mistake 3: Not Cleaning Between Drinks**
- Problem: Previous residue affects taste
- Result: Flavors contaminate next cocktail
- Solution: Rinse both strainers

**Mistake 4: Using Too Fine a Mesh**
- Problem: Takes forever to strain
- Result: Frustrating, inefficient
- Solution: Balance between fineness and speed

**Mistake 5: Not Positioning Correctly**
- Problem: Spills or misses glass
- Result: Messy, wasteful
- Solution: Practice positioning

## Double Straining by Cocktail Type

### Shaken Citrus Cocktails

**Essential Applications:**
- Whiskey Sour
- Daiquiri
- Sidecar
- Margarita
- All sour family drinks

**Why It's Critical:**
- Ice breaks into many pieces
- Citrus pulp present
- Seeds from limes and lemons
- Creates smooth, professional texture
- Industry standard

### Egg White Cocktails

**Absolutely Essential:**
- Whiskey Sour (with egg white)
- Ramos Gin Fizz
- Clover Club
- Any foamy cocktail

**Why Egg Whites Need It:**
- Creates smooth, creamy foam
- No lumps or clumps
- Perfect texture throughout
- Professional presentation
- Essential for quality

### Shaken Cocktails Without Citrus

**Still Beneficial:**
- Cream cocktails
- Martinis (if shaken)
- Any shaken cocktail
- Improves texture regardless
- Professional standard

**Benefits:**
- Eliminates ice chips
- Smoother texture
- Better presentation
- More professional result
- Worth the extra step

## Advanced Double Straining Techniques

### The One-Handed Method

**Professional Speed:**
- Hold both strainers together
- Create makeshift two-layer system
- Strain in one motion
- Faster for busy service
- Requires practice

**How It Works:**
- Fine mesh nestles inside Hawthorne
- Creates double-filter effect
- Single motion straining
- More efficient workflow
- Professional technique

### Clean and Quick

**Efficiency Tips:**
- Have strainers ready before mixing
- Position both over glass together
- Streamline the process
- Don't rush quality
- Practice makes smooth

**Workflow Integration:**
- Part of your routine
- Natural extension of stirring/shaking
- Second nature with practice
- Adds seconds, not minutes
- Worth the time

## Why Texture Matters

### Mouthfeel Science

**Sensory Experience:**
- Smooth texture enhances flavor
- Ice chips distract from taste
- Creamy texture adds luxury
- Professional quality perception
- Overall enjoyment

**Customer Perception:**
- Icy drinks feel cheap
- Smooth texture feels premium
- Attention to detail shows
- Professional care evident
- Worth the effort

### The Professional Difference

**What Customers Notice:**
- Smooth, silky texture
- No ice chips or debris
- Clean, clear appearance
- Consistent quality
- Professional presentation

**Why It Matters:**
- Elevates experience
- Shows craftsmanship
- Demonstrates care
- Professional standard
- Quality matters

## Equipment Care and Maintenance

### Cleaning Your Strainers

**After Each Use:**
- Rinse with hot water immediately
- Remove any stuck particles
- Prevent residue buildup
- Maintain food safety
- Extend equipment life

**Deep Cleaning:**
- Use dish soap for stuck debris
- Scrub coils carefully
- Ensure mesh is clear
- Dry completely
- Store properly

### Proper Storage

**Maintaining Quality:**
- Store in dry place
- Keep mesh protected
- Prevent bending or warping
- Maintain cleanliness
- Extend longevity

**Equipment Life:**
- Good strainers last years
- Proper care pays off
- Quality tools maintain quality
- Professional investment
- Worth maintaining

## Troubleshooting

### Clogged Fine Mesh

**Problem:**
- Too much pulp caught
- Straining too slow

**Solutions:**
- Use larger mesh size
- Strain through Hawthorne first (you should!)
- Clean between cocktails
- Don't let debris accumulate
- Maintain equipment

### Slow Straining

**Causes:**
- Mesh too fine for ingredients
- Too much pulp or ice
- Wrong order of operations

**Solutions:**
- Balance mesh fineness
- Hawthorne first always
- Clean regularly
- Right tool for the job
- Adjust as needed

## Professional Tips

### Speed and Efficiency

**Making It Fast:**
- Setup before you need it
- Have both strainers ready
- Practice the motion
- Make it fluid
- Don't sacrifice quality for speed

**Integration:**
- Part of muscle memory
- Natural workflow step
- Automatic habit
- Professional routine
- Second nature

### When Guests Ask

**Explaining the Process:**
- Educate about texture
- Show the difference
- Demonstrate craftsmanship
- Share technique knowledge
- Professional teaching

**Building Appreciation:**
- Customers notice quality
- They appreciate care
- Word spreads about quality
- Professional reputation
- Worth the education

## The Science Behind the Smoothness

### Ice Chip Problem

**Why Chips Form:**
- Ice breaks during shaking
- Impact creates small pieces
- Smaller pieces melt faster
- Uneven dilution results
- Texture suffers

**How Double Strain Fixes:**
- Removes all ice chips
- Prevents continued melting
- Consistent dilution
- Controlled texture
- Professional result

### Pulp and Sediment

**Natural Debris:**
- Citrus has pulp naturally
- Seeds can slip through
- Other fruits have fiber
- Natural but unwanted
- Professionals remove it

**Professional Solution:**
- Fine mesh catches everything
- Crystal-clear cocktails
- Smooth, clean texture
- No visible debris
- Premium quality

## Conclusion

The double strain technique is a simple yet transformative method that elevates any cocktail from good to exceptional. By taking those few extra seconds to strain twice, you create that silk-smooth texture and crystal-clear presentation that defines professional-quality cocktails.

**Key Takeaways:**
- Always double strain shaken cocktails
- Use Hawthorne strainer first, then fine mesh sieve
- Essential for egg white and citrus cocktails
- Creates professional-grade texture and clarity
- Worth the extra effort for quality

**Remember:**
- Quality equipment makes a difference
- Practice makes the process efficient
- Texture significantly enhances experience
- Details separate good from great
- Professional bartenders never skip this step

Mastering the double strain is investing in your cocktails' quality. Every perfectly smooth, crystal-clear drink you serve demonstrates your commitment to craft and attention to detail. That's the hallmark of a professional bartender.`;

    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 12,
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
