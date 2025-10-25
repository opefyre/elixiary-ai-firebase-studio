import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "golden-age-cocktails-prohibition-era";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# The Golden Age of Cocktails: Prohibition Era Mixology

Prohibition is often misunderstood as the "death" of cocktails, but in reality, this era from 1920-1933 represents one of the most fascinating and influential periods in cocktail history. While the "Noble Experiment" forced American cocktail culture underground, it also sparked innovation, birthed legendary cocktails, and transformed how people drank. Understanding Prohibition-era mixology reveals how cocktails survived, adapted, and ultimately influenced the global cocktail scene for decades to come.

## The Context: America Before Prohibition

### The Golden Age Leading Up

**Pre-Prohibition Excellence:**
- Professional bartending at its peak
- Jerry Thomas's legacy flourishing
- Classic cocktails perfected
- High-quality ingredients available
- Bartenders as respected craftsmen

**What Prohibition Threatened:**
- Banning manufacture, sale, and transportation of alcohol
- Constitutional amendment passed 1919
- Effective January 1920
- Threatened entire hospitality industry
- Forced creative adaptation

## Speakeasies: The Underground Revolution

### The Birth of Hidden Bars

**What Were Speakeasies:**
- Illicit establishments serving alcohol
- Name from speaking quietly to avoid detection
- Ranged from sophisticated to crude
- Operated in plain sight with secrecy
- Became cultural phenomenon

**The Social Impact:**
- Democratized high-end drinking
- Mixed social classes together
- Women drinking publicly for first time
- Created counterculture rebellion
- Shifted social drinking dynamics

### Iconic Speakeasy Establishments

**The 21 Club (New York):**
- Founded as speakeasy in 1920s
- Sophisticated hidden bar
- Took name when moved to 21 West 52nd Street
- Famous for celebrities and politicians
- Secret wine cellar doors and passageways

**Cotton Club (Harlem):**
- World-famous nightclub/speakeasy
- Jazz age cultural center
- African American entertainment
- Whites-only clientele initially
- Cocktails and live music

**Chumley's (Greenwich Village):**
- Converted garage as speakeasy
- Literary hangout for writers
- Secret entrances and exits
- Fireplace escape routes
- Boasted never raided by police

**Chicago's Underground:**
- Al Capone's operations
- More dangerous environment
- Organized crime involvement
- Violent competition
- Different from New York sophistication

## The Problem: Quality Spirits Vanished

### What Prohibition Destroyed

**Before Prohibition:**
- Aged whiskies and spirits
- Quality ingredients readily available
- Professional production standards
- Imported fine spirits
- Access to fresh ingredients

**During Prohibition:**
- Legitimate distilleries closed
- Imported spirits smuggled at premium
- Quality spirits became rare luxury
- Most drinking poorly made alcohol
- Dangerous homemade spirits common

### The Rise of Bathtub Gin

**Making Do with What Was Available:**
- Homemade alcohol production
- Mixed grain alcohol with botanicals
- Produced crude, harsh spirits
- Often chemically flavored
- Potentially dangerous contaminants

**The Quality Problem:**
- Raw, unaged spirits
- Industrial alcohol variants
- Fake brands and counterfeits
- Sometimes lethal methanol content
- Bartenders' challenge to improve

## Mixology Innovation: Masking Terrible Spirits

### The Sweetness Solution

**Why Sweet Cocktails Dominated:**
- Sugar masks harsh alcohol flavor
- Orange juice, grenadine, pineapple
- Fruit flavors covered crude spirits
- Made bathtub gin palatable
- Created new cocktail category

**Sweet Cocktails Born:**
- Clover Club
- Sidecar variations
- Collins family drinks
- Fruity highballs
- Sweet and sour combinations

### Citrus as Savior

**The Role of Fresh Juice:**
- Lemons and limes cut harshness
- Acid balanced sweet components
- Fresh flavor masked poor spirits
- Vitamin C helped prevent scurvy
- Bright, fresh taste

**Citrus-Based Classics:**
- Daiquiri variations
- Gimlet
- Tom Collins
- Sour family drinks
- Citrus-forward highballs

### The Bitters Bonanza

**Bitters to the Rescue:**
- Powerful flavors masked alcohol
- Added complexity to simple drinks
- Medicinal properties appreciated
- Available legally as "non-beverage"
- Essential in new cocktails

**Bitters-Heavy Cocktails:**
- Old Fashioned adaptations
- Manhattan variations
- Sazerac (still legal to import)
- Bittered sling drinks
- Medicine show cocktails

## Cocktails Born in Prohibition

### The Sidecar

**Origin and Evolution:**
- Disputed origins: Paris or London
- Popular during Prohibition era
- Cognac, Cointreau, lemon juice
- Balanced sweet and sour
- Sophisticated despite circumstances

**Why It Worked:**
- Premium ingredients when available
- Simple but elegant
- Good balance of flavors
- Easy to remember recipe
- International appeal

### The Clover Club

**Birth of a Classic:**
- Named after Philadelphia club
- Gin, lemon juice, raspberry syrup
- Egg white for texture
- Pretty pink color
- Feminine-appealing cocktail

**The Prohibition Twist:**
- Beautiful color distracts from quality
- Sweet and fruity masks gin
- Luxury appearance
- Easy to drink
- Socially acceptable for women

### The Bee's Knees

**Sweet Solution:**
- Gin, lemon juice, honey
- Created to mask bathtub gin
- Honey adds smoothness
- Natural sweetness
- Balancing harsh alcohol

**Why It Became Famous:**
- Flavorful despite poor spirits
- Simple to make
- Accessible ingredients
- International name appeal
- Survived beyond Prohibition

### The French 75

**Champagne Cocktail Adaptations:**
- Named for French 75mm field gun
- Various origins claimed
- Gin, lemon, sugar, champagne
- Effervescence masks flavors
- Iconic special-occasion drink

**Prohibition Luxury:**
- Champagne premium import
- Special-occasion indulgence
- Luxury presentation
- Sophisticated reputation
- Worth smuggling for

### The Mary Pickford

**Hollywood Connection:**
- Named for actress Mary Pickford
- Created in Havana/Paris
- White rum, pineapple, maraschino
- Bright, tropical flavor
- Celebrity cocktail culture

**International Prohibition:**
- Americans traveling for drinks
- Havana and Paris hot spots
- Celebrity bartending
- Tropical escape theme
- Glamorous associations

## The Expatriate Effect

### Americans Drinking Abroad

**The Diaspora:**
- Wealthy Americans traveled overseas
- Paris, Havana, London hubs
- Sought quality alcohol
- Developed international taste
- Brought recipes home after repeal

**International Cocktail Development:**
- Harry's Bar in Paris
- Hemingway's influence
- Luxury travel experiences
- European sophistication
- Cross-cultural exchange

### Cuba: The Nearest Speakeasy

**Havana's Golden Age:**
- Only 90 miles from Florida
- Legal drinking for Americans
- High-quality Cuban rum
- Tourist destination
- Cocktail innovation center

**Cuban Cocktails:**
- Daiquiri perfected
- Mojito popularized
- Cuban rum quality
- Hemingway specials
- International recognition

### Return Migration: Knowledge Lost

**The Knowledge Gap:**
- Many bartenders changed careers
- Recipes not written down
- Oral tradition interrupted
- Quality standards lost
- Rebuilding after repeal

**The Challenge After:**
- Relearning techniques
- Retraining bartenders
- Recovering recipes
- Rebuilding industry culture
- Years of recovery

## Prohibition's Lasting Influence

### Sweetness Becomes American Taste

**The Sweet Tooth Effect:**
- Americans developed sweet preference
- Carried into modern cocktail culture
- Contrast with European restraint
- Mass-market cocktail development
- Post-Prohibition cocktail evolution

**Modern Implications:**
- Sweet cocktails still popular
- Dessert cocktails category
- Fruit-forward preferences
- Different palates regionally
- Cultural influence

### Cocktails for Everyone

**Democratization of Drinking:**
- Speakeasies mixed social classes
- Women drinking equally
- African American performers and patrons
- Integration in social spaces
- Changed American drinking culture

**Social Impact:**
- Gender equality in drinking
- Breaking class barriers
- Counterculture movements
- Nightlife culture development
- Social liberation

### The Lore and Romance

**Mythology of Prohibition:**
- Legendary speakeasies
- Organized crime glamorization
- Secret doors and passwords
- Rebellious spirit romanticized
- Enduring fascination

**Cultural Legacy:**
- Movies and books immortalized
- Speakeasy revival in craft bars
- Secret bars and hidden entrances
- Prohibition-themed establishments
- Continued cultural interest

## Technical Innovations

### Bartending Survives

**Professional Skills Preserved:**
- Some bartenders worked internationally
- Knowledge maintained abroad
- Returned after repeal
- Training new generations
- Industry resilience

**Technique Evolution:**
- Worked with inferior ingredients
- Creative problem-solving
- Adaptation and innovation
- Enhanced mixing skills
- Professional dedication

### Glassware and Equipment

**Service Innovations:**
- Disposable cups for quick service
- Hidden storage solutions
- Mobile service during raids
- Quick cleanup methods
- Practical adaptations

**Post-Prohibition Evolution:**
- Professional equipment returned
- Modern glassware developed
- Service standards revived
- Presentation importance
- Hospitality excellence

## Modern Speakeasy Revival

### The Craft Cocktail Movement

**Return to Roots:**
- Prohibition-era inspiration
- Recreating speakeasy atmosphere
- Respecting classic techniques
- Quality ingredients prioritized
- Professional craftsmanship

**Modern Speakeasies:**
- Hidden entrance gimmick
- Prohibition-themed decor
- Classic cocktail focus
- Attention to detail
- Craft bartending emphasis

### Lessons from Prohibition

**What We Learned:**
- Quality ingredients matter
- Technique cannot be faked
- Community supports craft
- Perseverance overcomes adversity
- Cocktails are resilient

**Applying to Modern Bartending:**
- Using fresh ingredients
- Proper technique always matters
- Building cocktail culture
- Innovation within constraints
- Professional pride

## Famous Prohibition Era Personalities

### Bartenders Who Survived

**Harry Craddock:**
- American bartender in London
- Wrote Savoy Cocktail Book
- Preserved classic recipes
- Trained European bartenders
- Prohibition diaspora influence

**Trader Vic (Victor Bergeron):**
- Started during Prohibition
- Developed tropical cocktails
- Post-Prohibition expansion
- Tiki culture pioneer
- International cocktail influence

**Dale DeGroff's Teacher:**
- Joe Baum influence
- Training from Prohibition era
- Classic technique preservation
- Professional standards
- Legacy continuation

### Writers and Chroniclers

**F. Scott Fitzgerald:**
- Literary Prohibition depictions
- Cocktail descriptions in writing
- Social commentary
- Cultural documentation
- Historical record

**Ernest Hemingway:**
- Expatriate lifestyle
- Cuban drinking culture
- Celebrity cocktail preferences
- Literary influence
- Cultural ambassador

## Conclusion

Prohibition forced American cocktail culture underground, but rather than destroying it, the era created a crucible for innovation, survival, and transformation. The "Noble Experiment" birthed legendary cocktails, democratized drinking, sparked international exchange, and created romantic mythology that continues to inspire bartenders today.

**Prohibition's Paradoxes:**
- Suppressed but thrived
- Destroyed quality but created classics
- Forced underground but went global
- Threatened industry but built culture
- Anti-alcohol but produced innovation

**The Legacy Lives On:**
- Sweet cocktails remain popular
- Speakeasy atmosphere continues to inspire
- Classic cocktails survived
- International exchange expanded
- Quality focus renewed

**What Prohibition Taught:**
- Cocktail culture is resilient
- Innovation thrives in constraints
- Community sustains craft
- Quality always matters
- Technique survives adversity

The Prohibition era stands as one of the most misunderstood but influential periods in cocktail history. Rather than killing cocktails, it forced them to evolve, adapt, and ultimately thrive in unexpected ways. Modern cocktail culture owes much to those bartenders and drinkers who kept the craft alive through thirteen challenging years. Their legacy is every well-made drink we enjoy today.`;

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
