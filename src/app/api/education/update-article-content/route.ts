import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "pairing-cocktails-appetizers-small-plates";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# Pairing Cocktails with Appetizers and Small Plates

The art of pairing cocktails with food elevates both the drinks and the dishes, creating a harmonious dining experience that's greater than the sum of its parts. While wine pairings have long been established, cocktail pairings offer exciting new possibilities. This comprehensive guide will teach you how to match cocktails with appetizers and small plates like a professional.

## The Fundamentals of Cocktail Pairing

Understanding the core principles of pairing is essential before diving into specific combinations.

### Similarity vs. Contrast
**The Golden Rule**: You can pair by matching (similarity) or contrasting (complement) flavors, but avoid clashing.

**Similarity Pairing:**
- Citrus cocktails with citrus-seasoned dishes
- Herby cocktails with herby foods
- Spicy cocktails with spicy dishes
- Rich cocktails with rich, creamy dishes

**Contrast Pairing:**
- Acidic cocktails cut through fatty foods
- Sweet cocktails balance salty or spicy dishes
- Bubbly cocktails refresh palate between bites
- Herbal cocktails provide counterpoint to rich foods

### Weight and Intensity
**Match intensity levels:**
- Light, delicate cocktails with subtle flavors
- Medium-bodied cocktails with moderately seasoned dishes
- Bold, strong cocktails with robust, flavorful foods

### Primary Considerations
1. **Alcohol Content**: Higher ABV can overpower delicate foods
2. **Sweetness**: Balance sweet drinks with savory or salty foods
3. **Acidity**: Acidic cocktails cut through fat and richness
4. **Carbonation**: Bubbles cleanse palate and refresh
5. **Bitterness**: Can balance sweetness or overwhelm delicate dishes
6. **Herbaceousness**: Herbs can complement or clash with food herbs

## Classic Appetizer Pairings

### Oysters and Caviar
**Perfect Pairings:**
- **Martini** (gin or vodka): Clean, bracing, complements briny flavors
- **Champagne Cocktail**: Bubbles highlight delicate fish flavors
- **Gin Fizz**: Citrus and bubbles refresh palate

**Why They Work:**
- High acidity cuts through richness
- Low sugar doesn't compete with delicate flavors
- Fresh, clean spirits highlight ocean freshness

### Charcuterie Boards
**Perfect Pairings:**
- **Manhattan**: Rich, complex, stands up to bold cured meats
- **Old Fashioned**: Whiskey pairs with smoky, salty flavors
- **Negroni**: Bitter, herbal, complements fatty meats
- **Dry Martini**: Cleanses palate between bites

**Why They Work:**
- Strong flavors match intense cured meats
- Herbal notes complement seasoning
- Alcohol cuts through fat
- Bitterness balances salt

### Cheese Boards
**Perfect Pairings:**
- **Old Fashioned** with aged, sharp cheeses
- **French 75** with soft, creamy cheeses
- **Moscow Mule** with fresh, young cheeses
- **Port-based cocktails** with blue cheeses

**Why They Work:**
- Whiskey tannins complement aged cheese
- Citrus balances creamy textures
- Sweet wines work with salty, aged cheeses
- Herbs contrast dairy richness

## Small Plate Categories and Pairings

### Fried Foods

**Fried Chicken Wings:**
- **Bloody Mary**: Spice on spice, tomato complements
- **Whiskey Sour**: Citrus cuts through fat
- **Moscow Mule**: Ginger enhances heat

**Mozzarella Sticks:**
- **Negroni**: Bitter balance to fried, cheesy richness
- **Aperol Spritz**: Bubbles and bitterness refresh
- **Margarita**: Lime cuts through fried coating

**Tempura:**
- **Gin and Tonic**: Clean, herbal, complements dipping sauces
- **Sake-based cocktails**: Harmonizes with Japanese flavors
- **Moscow Mule**: Ginger complements dipping sauces

### Seafood Small Plates

**Shrimp Cocktail:**
- **Dry Martini**: Classic pairing, complements shrimp
- **Caipirinha**: Lime brings out briny flavors
- **Tom Collins**: Refreshing, lemon complements seafood

**Smoked Salmon:**
- **Champagne Cocktail**: Bubbles and acidity cut through oil
- **Vodka Martini**: Clean spirit complements fish
- **Blackberry Sage Smash**: Herbs enhance smokiness

**Tuna Tartare:**
- **Sake Martini**: Umami-on-umami pairing
- **Gin Fizz**: Herbs complement raw fish
- **Classic Gin Martini**: Let's fish flavors shine

### Meat-Based Small Plates

**Sliders/Burgers:**
- **Whiskey-based drinks**: Stand up to beef
- **Manhattan**: Rich, complements umami
- **Old Fashioned**: Traditional burger pairing

**Meatballs:**
- **Negroni**: Italian cocktail for Italian food
- **Manhattan**: Rich, complements meaty flavors
- **Whiskey Sour**: Acid cuts through richness

**Spicy Meat Skewers:**
- **Margarita**: Citrus and salt help with heat
- **Moscow Mule**: Ginger soothes spice
- **Paloma**: Grapefruit reduces burn

### Vegetable-Based Small Plates

**Brussels Sprouts (often roasted/bacon):**
- **Whiskey-based cocktails**: Stand up to bitterness
- **Old Fashioned**: Complements smoky, bitter flavors
- **Manhattan**: Rich enough for bacon

**Stuffed Mushrooms:**
- **Gin Martini**: Herbs complement mushrooms
- **Manhattan**: Earthy whiskey pairs with earthiness
- **Boulevardier**: Herbal, complements stuffing

**Caprese Salad:**
- **Aperol Spritz**: Light, refreshing, complements freshness
- **Gin Fizz**: Herbs and citrus highlight tomatoes
- **Dry Martini**: Clean, lets quality ingredients shine

## Advanced Pairing Techniques

### Balancing Sweetness
**The Salt-Sweet Balance:**
- Sweet cocktails (like Amaretto Sour) with salty snacks
- Salty dishes can make sweet drinks taste less sweet
- Balance is key - too much of either ruins the pairing

**Practical Examples:**
- Caramel cocktails with salt-topped pretzels
- Honey cocktails with salty prosciutto
- Fruity cocktails with salty fried foods

### Managing Heat and Spice
**Principles:**
- Alcohol intensifies capsaicin burn
- Sweetness (from sugar) reduces perceived heat
- Acid (from citrus) can mitigate spice
- Creamy cocktails can coat and soothe

**Best Pairings for Spicy:**
- **Mai Tai**: Pineapple and lime reduce heat
- **Moscow Mule**: Ginger helps with spice
- **Piña Colada**: Creamy, sweet, cools mouth

### Texture Considerations
**Matching Mouthfeel:**
- Creamy cocktails with creamy dishes
- Light, fizzy cocktails with crispy foods
- Smooth cocktails with tender dishes
- Complex cocktails with multi-textured plates

### Temperature Pairing
**The Cold Rule:**
- Cold cocktails with hot foods (refreshing contrast)
- Room temperature cocktails with room temp dishes
- Hot cocktails with room temperature or warm foods

**Exceptions:**
- Hot toddies with hearty winter appetizers
- Mulled wine cocktails with savory snacks
- Hot buttered rum with baked goods

## Dietary Restrictions and Considerations

### Vegetarian Pairings
- **Fruit-forward cocktails**: Complement vegetable flavors
- **Herbal cocktails**: Enhance plant-based seasonings
- **Light, fresh cocktails**: Don't overwhelm vegetables
- **Avoid heavy, meaty cocktails**: Unless dish is very rich

### Vegan Pairings
- Similar to vegetarian, but avoid honey-based drinks
- Focus on citrus and herbal cocktails
- Light spirits work best
- Plant-based syrups preferred

### Gluten-Free Considerations
- Most distilled spirits are gluten-free
- Watch out for beer-based cocktails
- Clear spirits (vodka, gin, tequila) are safest
- Always verify if serving those with celiac disease

### Allergy Awareness
- Citrus cocktails can trigger citrus allergies
- Nut-based liqueurs (amaretto, frangelico) for tree nut allergies
- Egg whites in cocktails for egg allergies
- Always communicate ingredients clearly

## Regional Flavor Combinations

### Mediterranean Flavors
**Typical Appetizers:** Tapenade, hummus, tzatziki, grilled vegetables
**Perfect Cocktails:**
- **Aperol Spritz**: Italian aperitif tradition
- **Negroni**: Bitter herbal profile
- **Dry Martini**: Clean, complements olives

### Asian Flavors
**Typical Appetizers:** Spring rolls, dumplings, bao buns
**Perfect Cocktails:**
- **Sake-based drinks**: Umami harmony
- **Gin and Tonic**: Clean, complements dipping sauces
- **Moscow Mule**: Ginger pairs with Asian spices

### Latin American Flavors
**Typical Appetizers:** Guacamole, ceviche, empanadas
**Perfect Cocktails:**
- **Margarita**: Citrus complements lime-based dishes
- **Paloma**: Grapefruit complements Latin flavors
- **Pisco Sour**: Indigenous to South America

### American Southern Flavors
**Typical Appetizers:** Pimento cheese, fried pickles, deviled eggs
**Perfect Cocktails:**
- **Mint Julep**: Bourbon tradition
- **Sazerac**: New Orleans classic
- **Whiskey Smash**: Bourbon-based fruit cocktail

## Seasonal Considerations

### Spring Appetizers
- Light, fresh vegetables
- Bright, citrusy flavors
- Tender, delicate preparations

**Pair with:** Gin-based, citrus cocktails, Aperol Spritz

### Summer Appetizers
- Fresh salads
- Raw seafood
- Grilled vegetables

**Pair with:** Light, bubbly, fruity cocktails

### Fall Appetizers
- Roasted vegetables
- Rich, earthy flavors
- Game meats

**Pair with:** Whiskey-based, spiced cocktails

### Winter Appetizers
- Comfort foods
- Rich, hearty flavors
- Warm preparations

**Pair with:** Bold, warming cocktails, whiskey-forward

## Cocktail Menu Building

### The Progression Principle
**Order Matters:**
1. Start light and refreshing
2. Build to bolder flavors
3. End with something special
4. Clear palate between courses

### Creating a Pairing Menu
**Three-Tier Approach:**
1. **Light Start**: Mimosas, Aperol Spritz, Gin Fizz
2. **Mid-Course**: Martini, Negroni, Manhattan
3. **Heavier End**: Old Fashioned, Whiskey Sour, Mai Tai

### The House Specialty
Every menu should have a signature pairing that showcases the chef and bartender working together.

## Common Pairing Mistakes to Avoid

### Mistake 1: Overpowering Delicate Foods
**Problem**: Strong cocktails with subtle dishes
**Solution**: Match intensity - light with light

### Mistake 2: Competing Flavors
**Problem**: Similar dominant flavors clash
**Solution**: One should complement, not compete

### Mistake 3: Ignoring Texture
**Problem**: Mismatched mouthfeels
**Solution**: Consider how drinks feel in the mouth

### Mistake 4: Forgetting Temperature
**Problem**: All cold cocktails with all cold dishes
**Solution**: Use temperature as a pairing tool

### Mistake 5: Not Considering Progression
**Problem**: No thought to meal flow
**Solution**: Build intensity throughout meal

## Hosting a Cocktail Pairing Party

### Planning Your Menu
1. Choose a theme (Italian, Asian, Regional)
2. Plan 3-5 small plates
3. Match 1-2 cocktails per plate
4. Consider dietary restrictions
5. Provide non-alcoholic options

### Presentation Tips
- Use appropriate glassware
- Garnish to match dish aesthetic
- Color coordination matters
- Serve at appropriate temperatures

### Serving Order
1. Welcome drink (bubbly, refreshing)
2. Progressive pairings with each course
3. Optional digestif to end

## Building Your Pairing Skills

### Practice Makes Perfect
- Experiment regularly
- Take notes on what works
- Try both similarity and contrast
- Don't be afraid to experiment

### Resources for Learning
- Follow expert pairers
- Read cocktail pairing books
- Attend pairing events
- Practice with friends

### Developing Your Palate
- Taste intentionally
- Identify flavor profiles
- Notice how flavors change together
- Trust your instincts

## Conclusion

Mastering the art of pairing cocktails with appetizers and small plates opens up a world of culinary possibilities. The key is understanding the interplay between flavors, textures, and intensities. Remember that while there are guidelines and classic pairings, personal preference plays a significant role.

**Best Practices:**
- Balance is everything - don't let one element overpower
- Experiment fearlessly - some best pairings are discovered accidentally
- Trust your palate - if it tastes good, it's a good pairing
- Consider the entire experience - presentation and service matter
- Have fun - pairing should be enjoyable, not stressful

Whether you're a home entertainer or aspiring hospitality professional, these principles will help you create memorable experiences that delight your guests and showcase your skills as both a host and a cocktail enthusiast. The art of pairing is about creating harmony, surprise, and delight - so raise a glass and let the journey of flavor discovery begin!`;

    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 19,
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
