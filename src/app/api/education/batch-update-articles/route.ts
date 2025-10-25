import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    // Define all articles to update with their full content
    const articles = [
      {
        slug: "building-layers-cocktails-advanced-techniques",
        title: "Building Layers in Cocktails: Advanced Techniques",
        content: "# Building Layers in Cocktails: Advanced Techniques\n\nLayering flavors in cocktails is the advanced art of creating drinks where each ingredient is distinguishable but harmonious—where each sip reveals new dimensions of flavor.\n\n## Understanding Flavor Layers\n\nEffective layering requires understanding how different ingredients interact.\n\n### Base Spirit Foundation\n\n- Start with quality base spirit\n- Foundation supports other flavors\n- Should be present but not dominant\n- Choose spirits that complement layers\n\n### Supporting Flavors\n\n- Liqueurs add complexity\n- Syrups provide sweetness\n- Bitters enhance depth\n- Each layer adds dimension\n\n## Building Techniques\n\n### Gradual Integration\n\n- Add ingredients thoughtfully\n- Taste as you build\n- Balance is crucial\n- Each addition matters\n\n### Flavor Intensity\n\n- Strong vs subtle flavors\n- Dominant vs supporting\n- Creating harmony\n- No single ingredient dominates\n\n## Classic Layered Cocktails\n\n### Manhattan\n\n- Rye/whiskey base\n- Sweet vermouth layer\n- Bitters enhance\n- Perfect balance\n\n### Negroni\n\n- Equal parts perfect\n- Gin provides structure\n- Campari bitter layer\n- Vermouth sweetness\n\n## Advanced Tips\n\nPractice and experience develop intuition for building harmonious layers.",
        readingTime: 15
      },
      {
        slug: "advanced-muddling-techniques-maximum-flavor",
        title: "Advanced Muddling Techniques for Maximum Flavor",
        content: "# Advanced Muddling Techniques for Maximum Flavor\n\nMuddling is often misunderstood as simple crushing, but true muddling is the art of extracting flavors and oils without pulverizing ingredients.\n\n## The Purpose of Muddling\n\nMuddling extracts essential oils and flavors from herbs, fruits, and spices.\n\n### What Muddling Does\n\n- Releases aromatic oils\n- Extracts juice from fruit\n- Breaks down herbs gently\n- Releases flavor compounds\n- Creates flavor foundation\n\n## Proper Technique\n\n### Gentle Pressing\n\n- Don't crush aggressively\n- Press and twist motion\n- Release oils, not pulp\n- Preserve structure\n\n### Pressure Matters\n\n- Too hard: Bitter flavors\n- Too soft: No extraction\n- Just right: Perfect release\n- Practice develops feel\n\n## Ingredients That Need Muddling\n\n### Mint and Herbs\n\n- Release oils gently\n- Don't shred leaves\n- Bruise to release aroma\n- Maintain fresh appearance\n\n### Citrus Peels\n\n- Extract oils from skin\n- Avoid bitter pith\n- Gentle pressure\n- Citrus oils enhance drinks\n\n### Fresh Fruits\n\n- Soft fruits for juice\n- Berries release color\n- Stone fruits add sweetness\n- Balance pulp vs liquid\n\n## Common Mistakes\n\n- Over-muddling\n- Under-muddling\n- Wrong pressure\n- Skipping ingredients\n- Using wrong tool\n\n## Best Practices\n\nUse quality muddler, apply gentle pressure, work in circular motion, taste as you go, clean tool between uses.",
        readingTime: 12
      },
      {
        slug: "instagram-cocktail-presentations",
        title: "Creating Instagram-Worthy Cocktail Presentations",
        content: "# Creating Instagram-Worthy Cocktail Presentations\n\nVisual presentation elevates cocktails from drinks to experiences. Instagram-worthy cocktails combine taste with visual artistry.\n\n## Elements of Visual Appeal\n\n### Color Harmony\n\n- Vibrant, contrasting colors\n- Natural fruit colors\n- Layered colors\n- Garnish complements\n\n### Glassware Selection\n\n- Right glass for drink\n- Unique shapes\n- Clear crystal\n- Proper size\n\n## Garnish Strategy\n\n### Edible Decorations\n\n- Fresh fruit slices\n- Citrus wheels or twists\n- Berries and herbs\n- Fresh flowers\n\n### Functional Garnishes\n\n- Enhance aroma\n- Add taste\n- Contribute to experience\n- Not just decoration\n\n## Lighting and Photography\n\n### Natural Light Best\n\n- Near window\n- Avoid harsh shadows\n- Soft diffused light\n- Show true colors\n\n### Composition\n\n- Rule of thirds\n- Negative space\n- Interesting angles\n- Clean background\n\n## Pro Tips\n\n- Fresh ingredients\n- Clean glass edges\n- Proper serving temperature\n- Thoughtful garnishes\n- Consistent branding",
        readingTime: 10
      },
      {
        slug: "essential-bar-tools-complete-guide",
        title: "Essential Bar Tools: A Complete Equipment Guide",
        content: "# Essential Bar Tools: A Complete Equipment Guide\n\nQuality tools make quality drinks. Professional bartenders invest in equipment that performs consistently and lasts.\n\n## Core Tools\n\n### Shaker Set\n\n- Boston or Cobbler shaker\n- Quality construction\n- Tight seal important\n- Leak-proof essential\n\n### Strainers\n\n- Hawthorne strainer\n- Julep strainer\n- Fine mesh strainer\n- Quality matters\n\n### Bar Spoon\n\n- Long handle\n- Twisted shaft\n- Functions: stir, layer, measure\n\n### Muddler\n\n- Wood or food-grade plastic\n- Proper size\n- Gentle but effective\n\n## Measuring Tools\n\n### Jiggers\n\n- Accurate measurements\n- Multiple sizes\n- Quality stainless steel\n- Clear markings\n\n### Measuring Spoons\n\n- Precision for small amounts\n- Syrups and bitters\n- Consistent drinks\n\n## Cutting Tools\n\n### Channel Knife\n\n- Citrus peel garnish\n- Create twists\n- Decorative spirals\n\n### Paring Knife\n\n- Clean cuts\n- Fruit preparation\n- Versatile tool\n\n## Investment Tips\n\n- Buy once, cry once\n- Quality over quantity\n- Professional brands\n- Proper maintenance",
        readingTime: 14
      },
      {
        slug: "choosing-right-cocktail-shaker",
        title: "Choosing the Right Cocktail Shaker",
        content: "# Choosing the Right Cocktail Shaker\n\nYour shaker is your most important tool. Understanding different types helps you choose what works for you.\n\n## Shaker Types\n\n### Boston Shaker\n\n- Two-piece set\n- Pint glass + tin\n- Popular in commercial bars\n- Versatile and durable\n\nPros: Large capacity, durable, professional standard\nCons: Requires strainer, takes practice\n\n### Cobbler Shaker\n\n- Three-piece design\n- Built-in strainer\n- All-in-one convenience\n- Perfect for home bars\n\nPros: Self-contained, easy to use, portable\nCons: Smaller capacity, can leak\n\n### French Shaker\n\n- Glass mixing tin\n- Metal tin combo\n- Elegant appearance\n- Less common\n\nPros: Beautiful, good seal\nCons: Fragile glass, less common\n\n## Choosing Your Shaker\n\n### Consider Your Needs\n\n- Home vs commercial use\n- Skill level\n- Drink volume needed\n- Storage space\n\n### Quality Indicators\n\n- Thick, durable metal\n- Secure seal\n- Comfortable grip\n- Professional brands\n\n## Proper Use\n\n### Technique\n\n- Dry shake first (no ice)\n- Add ice\n- Shake 10-15 seconds\n- Double strain\n\n## Maintenance\n\n- Clean immediately\n- Dry completely\n- Check seals\n- Store properly",
        readingTime: 11
      },
      {
        slug: "garnish-essentials-cocktail-presentation",
        title: "Garnish Essentials: Elevating Your Cocktail Presentation",
        content: "# Garnish Essentials: Elevating Your Cocktail Presentation\n\nGarnishes aren't just decoration—they enhance aroma, flavor, and the entire drinking experience.\n\n## Purpose of Garnishes\n\n### Aromatic Enhancement\n\n- Release essential oils\n- Enhance nose\n- First impression\n- Set flavor expectations\n\n### Visual Appeal\n\n- Beautiful presentation\n- Professional appearance\n- Instagram-worthy\n- Complete the drink\n\n## Classic Garnishes\n\n### Citrus Twists\n\n- Lemon, lime, orange\n- Express oils over drink\n- Rim glass edge\n- Aromatic and visual\n\n### Fresh Herbs\n\n- Mint sprigs\n- Rosemary stalks\n- Basil leaves\n- Adds freshness\n\n### Fruit Garnishes\n\n- Cherry skewers\n- Berries\n- Pineapple wedges\n- Color and taste\n\n## Professional Techniques\n\n### Expressing Oils\n\n- Twist citrus peel\n- Mist over drink\n- Oils land on surface\n- Immediate aroma\n\n### Placement\n\n- Avoid blocking drink\n- Easy to drink around\n- Visual balance\n- Functional beauty\n\n## Garnish by Drink Type\n\n- Martini: Lemon twist or olive\n- Old Fashioned: Orange peel\n- Mojito: Mint sprig and lime\n- Margarita: Salt rim and lime wedge\n\n## Best Practices\n\n- Fresh ingredients only\n- Express citrus oils\n- Minimal, intentional\n- Clean presentation\n- Never overwhelming",
        readingTime: 9
      }
    ];

    const results = [];
    
    for (const article of articles) {
      try {
        const articlesSnapshot = await adminDb.collection('education_articles')
          .where('slug', '==', article.slug)
          .get();

        if (!articlesSnapshot.empty) {
          const articleDoc = articlesSnapshot.docs[0];
          const articleId = articleDoc.id;

          await adminDb.collection('education_articles').doc(articleId).update({
            content: article.content,
            readingTime: article.readingTime,
            updatedAt: new Date(),
            wordCount: article.content.split(/\s+/).length,
            lastReviewed: new Date()
          });

          results.push({
            success: true,
            articleId: articleId,
            slug: article.slug,
            title: article.title,
            wordCount: article.content.split(/\s+/).length
          });
        } else {
          results.push({
            success: false,
            slug: article.slug,
            title: article.title,
            error: "Article not found"
          });
        }
      } catch (error: any) {
        results.push({
          success: false,
          slug: article.slug,
          title: article.title,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Batch update completed",
      totalArticles: articles.length,
      results: results
    });
  } catch (error: any) {
    console.error("Error updating articles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
