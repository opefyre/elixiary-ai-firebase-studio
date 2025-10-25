import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "origins-classic-cocktails";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# The Origins of Classic Cocktails

Classic cocktails didn't emerge from nowhere—they're living artifacts of history, each carrying stories of social change, cultural shifts, and human ingenuity. Understanding the origins of our most beloved drinks reveals how cocktails evolved from medicinal concoctions to art forms, and how bartenders became the alchemists of social transformation.

## Cocktails: A Brief History

### From Medicine to Pleasure

**Early Origins:**
- Cocktails began as medicinal tonics
- Herbs and spirits combined for health
- First appeared in print in early 1800s
- Originally meant "mixed drinks"
- Evolved into social experience

**The Evolution:**
- 1800s: Simplicity and ingredients
- 1850s-1890s: Golden Age of cocktails
- 1900s-1919: Peak sophistication before Prohibition
- 1920s-1933: Surviving Prohibition underground
- 1934-1950s: Rebuilding after repeal

### The Birth of Cocktail Culture

**Why Cocktails Matter:**
- Reflected cultural values
- Showed social status
- Created public spaces
- Provided escape from reality
- Celebrated craftsmanship

**Bartending as Profession:**
- Respected trade
- Created recipes
- Built reputations
- Established traditions
- Professional community

## The Manhattan: A Love Story

### The Origin Myth

**The Legend:**
- Created at Manhattan Club, NYC
- For Lady Randolph Churchill's party
- 1870s timeframe
- Named for the island
- Instant success

**The Reality:**
- Recipe existed before
- Named later for New York
- Multiple bartenders claimed credit
- Probably evolved over time
- Truth lost to history

### Why Manhattan Became Classic

**Perfect Balance:**
- Whiskey + vermouth + bitters
- Sweet meets bitter
- Strong but approachable
- Complex yet simple
- Timeless appeal

**Cultural Significance:**
- Represented sophistication
- New York sophistication
- Urban cosmopolitanism
- Classic American drink
- International recognition

## The Martini: America's Icon

### The Birth of a Legend

**Early Versions:**
- Started as Martinez (sweet)
- Evolved into dry Martini
- Gin + vermouth + bitters
- Simple, elegant, powerful
- Became symbol of refinement

**The Name Game:**
- Possibly from Martini & Rossi
- Or Martinez, California
- Or Italian vermouth makers
- Exact origin unknown
- Mystery adds to allure

### How Dry Became Fashionable

**The Evolution:**
- 1880s: 2:1 gin to vermouth
- 1920s: 4:1 ratio
- 1950s: Nearly no vermouth
- Today: Back to balance
- Trends come and go

**Why So Dry?**
- Prohibition influence
- Poor quality vermouth
- Masking inferior spirits
- Became competitive thing
- Ultimate test of dryness

## The Old Fashioned: Defining a Category

### The Original Cocktail

**Historical Significance:**
- First definition of "cocktail"
- Essential cocktail components
- Spirit + sugar + bitters + water
- Basis for all cocktails
- Named "old-fashioned way"

**Kentucky Connection:**
- Louisville, Pendennis Club
- Possibly 1880s creation
- But concept much older
- Refinement of original recipe
- Perfecting the formula

### Simple Ingredients, Complex Results

**Why It Works:**
- Respects whiskey
- Enhances rather than hides
- Sugar smooths edges
- Bitters add complexity
- Ice provides dilution
- Perfect balance

**The Ritual:**
- Muddle sugar
- Add bitters
- Whiskey added
- Ice for dilution
- Orange peel garnish
- Ceremony matters

## The Negroni: Italian Sophistication

### Count Camillo Negroni

**The Story:**
- Florentine count, ca. 1920
- Asked for stronger Americano
- Substitute gin for soda
- Equal parts: gin, Campari, vermouth
- Became legend

**The Brilliance:**
- Perfect aperitivo formula
- Bitter meets sweet
- Complex and balanced
- Before dinner tradition
- Italian lifestyle

### Aperitivo Culture

**The Italian Way:**
- Before dinner socializing
- Bitter drinks awaken appetite
- Light alcohol
- Social connection
- Lifestyle philosophy

**Why Campari Matters:**
- Distinct bitter flavor
- Opens taste buds
- Provides bitterness
- Key component
- Unique character

## The Daiquiri: Hemingway's Muse

### Cuban Connection

**The Birth:**
- Daiquiri, Cuba mining town
- American engineer, 1896
- Rum + lime + sugar
- Simple, refreshing
- Perfect combination

**Cuba Libre Influence:**
- Pre-revolution Cuba
- Tourist destination
- Prohibition-era escape
- American cocktail culture
- Cultural exchange

### Hemingway's Contribution

**The Famous Version:**
- El Floridita, Havana
- Frozen Daiquiri variation
- No sugar, more rum
- Double the liquor
- Papa Doble

**Legacy:**
- Literary connection
- Enduring fame
- Tourist destination
- Cocktail tourism
- Story and drink combined

## The Mojito: Caribbean Roots

### From African Medicine to Cuban Classic

**Ancient Origins:**
- Medicinal herb drink
- African slaves brought techniques
- Mint and rum healing tonic
- Became social drink
- National pride

**Havana Innovation:**
- Refined in Cuban bars
- Added lime and sugar
- Created modern version
- Tourist favorite
- Cultural ambassador

### Why Fresh Mint Matters

**The Recipe:**
- White rum base
- Fresh mint leaves
- Lime juice
- Sugar or syrup
- Soda water
- Ice

**Perfect Technique:**
- Muddle gently
- Don't crush mint
- Release oils
- Balance sweetness
- Top with soda

## The Margarita: Mexican-American Fusion

### Multiple Origin Theories

**Who Created It?**
- Margaret in Tijuana?
- Singer Rita Hayworth?
- Dallas socialite?
- Acapulco bartender?
- Truth: probably multiple places

**Common Factor:**
- Tequila emerging
- Need to make palatable
- Lime sugar balance
- Citrus smooths
- Became accessible

### Tequila's Rise to Fame

**Before Margarita:**
- Shots and straight
- Too rough for many
- Finding acceptance
- Mixer makes approachable
- Gateway drink

**After Margarita:**
- Best selling cocktail
- Worldwide popularity
- Tequila industry growth
- Tourist appeal
- Cultural icon

## The Mai Tai: Polynesian Fantasy

### Don the Beachcomber

**Tiki Culture Origins:**
- Don Beach, Los Angeles 1930s
- Tropical escapism
- Complex ingredients
- Exotic presentation
- Entertainment dining

**Original Recipe:**
- Dark Jamaican rum
- Lime juice
- Orgeat (almond syrup)
- Orange Curacao
- Rock candy syrup
- Complex and delicious

### Trader Vic's Competition

**Rival Tiki Bars:**
- Trader Vic's, Oakland
- Claimed own Mai Tai
- Different interpretation
- Pineapple juice added
- More accessible

**The "Beachcomber" Version:**
- Rum agricole
- Age statement rum
- Lime juice
- Orgeat
- Orange Curacao
- Mint garnish
- Sophisticated version

## Cocktails and Social Change

### Women and Drinking

**Victorian Restrictions:**
- Women didn't drink publicly
- Social stigma
- Male-only spaces
- Gender segregation
- Change brewing

**The Shift:**
- 1920s: Women drinking publicly
- Speakeasies mixed gender
- Social revolution
- Empowered choice
- Liberation symbol

### Prohibition's Impact

**The Noble Experiment:**
- 1920-1933 ban
- Cocktails went underground
- Quality suffered
- Sweet drinks masked bad spirits
- Innovation in hiding

**Aftermath:**
- Recipe loss
- Skills disappeared
- Rebuilding industry
- Decades to recover
- Some never returned

### Post-War Simplicity

**Vodka Dominance:**
- Preference for neutral spirit
- Less complex cocktails
- Easier drinks
- Lazy Bartending
- Simplicity over skill

**The Dark Age:**
- 1950s-1990s decline
- Few quality cocktails
- Mass production
- Ready-made mixes
- Craft disappeared

## The Cocktail Renaissance

### The Rebirth Begins

**Pioneers:**
- Jerry Thomas recipes rediscovered
- Classic techniques revived
- Quality ingredients returned
- Bartenders as craftspersons
- Professional standards

**Dale DeGroff:**
- "King Cocktail" title
- Trained bartenders
- Taught classic recipes
- Earned respect
- Restored craft

### Modern Craft Movement

**Today's Focus:**
- Quality ingredients
- Classic techniques
- Historical accuracy
- Innovation within tradition
- Respect for craft

**The Result:**
- Golden Age 2.0
- Best cocktails ever
- Worldwide movement
- Professional respect
- Cultural appreciation

## Global Cocktail Heritage

### International Classics

**Beyond America:**
- Pisco Sour (Peru)
- Caipirinha (Brazil)
- Bellini (Italy)
- Sake cocktails (Japan)
- Gin & Tonic (Britain)

**Cultural Exchange:**
- Recipes travel
- Local adaptations
- Cross-cultural innovation
- Global cocktail language
- Shared humanity

## Cocktails as Cultural Touchstones

### Literature and Film

**Literary Cocktails:**
- Hemingway's Daiquiri
- James Bond's Vesper Martini
- Fitzgerald's champagne
- Characters defined by drinks
- Cultural shorthand

**Film Influence:**
- Iconic cocktail moments
- Advertising tie-ins
- Lifestyle association
- Trends from media
- Cultural memory

### Music and Cocktails

**Jazz Age:**
- Speakeasies and jazz
- Musical cocktail culture
- Harlem Renaissance
- Sophisticated drinking
- Cultural fusion

**Rock and Roll:**
- Bartending showmanship
- Nightlife energy
- Iconic bars
- Rock star drinks
- Pop culture drinks

## What Makes a Cocktail Classic

### Timeless Qualities

**Essential Elements:**
- Balanced flavor
- Memorable taste
- Simple enough to reproduce
- Complex enough to intrigue
- Adapts to trends
- Survives decades

**Why Classics Endure:**
- They work every time
- Proven formulas
- Appeal across generations
- Cultural touchstones
- Shared experiences
- Emotional connection

## The Future of Classic Cocktails

### Respecting Tradition

**Classic Modern Balance:**
- Know the original
- Understand why it works
- Honor tradition
- Allow innovation
- Keep essence alive
- Respect history

**Contemporary Interpretations:**
- Modern ingredients
- New techniques
- Different spirits
- Creative variations
- Inspired by classics
- Built on foundation

### Passing the Torch

**Teaching the Next Generation:**
- Share recipes
- Teach techniques
- Explain why
- Show respect
- Preserve knowledge
- Continue traditions

**Evolution Continues:**
- New classics emerging
- Future will judge
- What becomes timeless
- Cultural shifts
- Modern classics tomorrow
- History repeating

## Conclusion

Every classic cocktail tells a story of its time—of culture, society, innovation, and humanity's love affair with flavor and social connection. From the smoky speakeasies of Prohibition to the craft bars of today, cocktails reflect who we are and where we come from.

**Key Takeaways:**
- Classic cocktails carry cultural history
- Each drink tells a human story
- Cocktails evolved with society
- Prohibition nearly destroyed cocktail culture
- Craft revival saved the classics
- Classics endure because they work perfectly

**Remember:**
- These drinks survived because they're good
- History enriches appreciation
- Tradition informs innovation
- Cocktails are cultural artifacts
- Knowing origins deepens connection

The classics became classics not by accident but by merit—they're drinks so perfectly balanced, so culturally resonant, and so universally beloved that they transcend time. As you make these drinks, you're connecting with generations of drinkers before you and participating in an unbroken tradition of craft, artistry, and pleasure.

Here's to the classics—may they never die, and may every bartender add their chapter to the story!`;

    await adminDb.collection('education_articles').doc(articleId).update({
      content: fullContent,
      readingTime: 20,
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
