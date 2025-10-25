import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseServer } from '@/firebase/server';

export async function POST(request: NextRequest) {
  try {
    const { adminDb } = initializeFirebaseServer();

    const articleSlug = "home-bar-lighting-design";
    
    const articlesSnapshot = await adminDb.collection('education_articles')
      .where('slug', '==', articleSlug)
      .get();

    if (articlesSnapshot.empty) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    const articleDoc = articlesSnapshot.docs[0];
    const articleId = articleDoc.id;

    const fullContent = `# Home Bar Lighting Design for Ambiance and Function

Lighting is one of the most transformative elements of a home bar. Proper lighting design creates ambiance that makes drinks more enjoyable, enables safe and efficient cocktail-making, showcases your collection beautifully, and elevates your entire home bar experience from functional to extraordinary. This comprehensive guide explores how to design layered lighting that balances aesthetic appeal with practical functionality.

## Why Lighting Matters

### Creating the Right Atmosphere

**Ambiance in Home Bartending:**
- Sets the mood for relaxation and enjoyment
- Transforms your bar into an inviting space
- Makes cocktail-making feel like an event
- Creates memorable experiences for guests
- Enhances the ritual and ceremony of drinking

**The Social Element:**
- Good lighting encourages gathering
- Creates welcoming environment for guests
- Makes people want to linger and enjoy
- Professional appearance impresses visitors
- Social hub feeling in your home

### Functional Requirements

**Practical Illumination:**
- See ingredients clearly while mixing
- Read labels on bottles accurately
- Prevent spills and accidents
- Work efficiently during service
- Ensure quality control in drink-making

**Safety Considerations:**
- Safe handling of tools and equipment
- Visibility when using sharp items
- Clear sight for measuring accurately
- Prevent burns from hot elements
- Navigate space without obstacles

### Showcasing Your Collection

**Display Enhancement:**
- Showcase spirits and glassware beautifully
- Highlight rare and special bottles
- Create dramatic focal points
- Professional bar presentation
- Turn collection into art display

**Visual Impact:**
- Label visibility for browsing
- Color and clarity of spirits
- Glassware sparkle and shine
- Professional aesthetic appeal
- Impressive visual presentation

## Understanding Light Layers

### Ambient (General) Lighting

**Purpose:**
- Overall illumination of the entire space
- Base level of brightness throughout
- Sets general mood of the room
- Prevents harsh contrasts
- Foundation for layered lighting

**Best Options:**
- Recessed downlights for even distribution
- Track lighting for flexible direction
- Indirect lighting for soft glow
- Pendant lights for overhead illumination
- Cove lighting for ambient glow

**Considerations:**
- Avoid overly bright general light
- Use dimmers for adjustable ambiance
- Warm color temperature preferred
- Even distribution across space
- Foundation for other layers

### Task Lighting

**Purpose:**
- Focused illumination for work areas
- Bright, direct light for mixing
- Reading labels and measuring
- Prevent shadows on work surface
- Enable safe and accurate work

**Best Options:**
- Under-cabinet strip lights
- Pendant lights over work surface
- Track lighting directed at bar
- Adjustable swing-arm lamps
- Portable task lights

**Considerations:**
- Bright enough for detail work
- Color rendering for accuracy
- Minimal shadows on workspace
- Adjustable for different tasks
- Dedicated to work zones

### Accent Lighting

**Purpose:**
- Highlight specific features
- Showcase collection displays
- Create visual interest and drama
- Draw attention to focal points
- Add depth and dimension

**Best Options:**
- LED strip lights in shelves
- Track lighting for bottle displays
- Picture lights for artwork
- Backlit shelving systems
- Directional spotlights

**Considerations:**
- Focused and directional
- Higher intensity than ambient
- Creates visual hierarchy
- Strategic placement important
- Dramatic contrast for impact

### Decorative Lighting

**Purpose:**
- Aesthetic enhancement
- Contribute to overall ambiance
- Add personality and style
- Create conversation pieces
- Complete the design vision

**Best Options:**
- Decorative pendant fixtures
- Statement chandeliers
- Edison bulb string lights
- Neon signs or art pieces
- Vintage or themed fixtures

**Considerations:**
- Enhance rather than dominate
- Match overall design style
- Add character without clutter
- Quality over quantity
- Personal expression

## Lighting Color Temperature

### Warm White (2700K-3000K)

**Characteristics:**
- Cozy, inviting glow
- Traditional incandescent feel
- Enhances warm tones
- Relaxing and comfortable
- Traditional home bar aesthetic

**Best For:**
- Ambient room lighting
- General bar illumination
- Lounge seating areas
- Creating welcoming atmosphere
- Traditional and classic designs

### Cool White (4000K-5000K)

**Characteristics:**
- Bright, energetic light
- Mimics daylight quality
- Enhances clarity and sharpness
- Good color rendering
- Clean and modern aesthetic

**Best For:**
- Task lighting for mixing
- Work surface illumination
- Reading labels accurately
- Modern design aesthetics
- High-contrast detail work

### Tunable White (Adjustable)

**Characteristics:**
- Adjust between warm and cool
- Adapt to different times of day
- Change mood with activity
- Best of both worlds
- Smart home integration

**Best For:**
- Versatile lighting needs
- Smart home enthusiasts
- Different activities and moods
- Modern technology integration
- Maximum flexibility

## Lighting Fixtures for Home Bars

### Recessed Downlights

**Features:**
- Clean, minimalist appearance
- Even distribution of light
- Fits any ceiling height
- Unobtrusive design
- Professional installation required

**Best Uses:**
- General ambient lighting
- Even room illumination
- Modern, clean aesthetics
- Concealed light sources
- Professional appearance

**Considerations:**
- Requires installation by professional
- Placement important for coverage
- Use dimmers for control
- Warm LED options available
- Plan layout carefully

### Track Lighting

**Features:**
- Flexible directional adjustment
- Highlight specific areas
- Reconfigurable as needs change
- Professional gallery aesthetic
- Multiple fixtures on one track

**Best Uses:**
- Accent lighting for displays
- Task lighting over bar
- Reconfigurable arrangements
- Modern and industrial styles
- Flexible spotlighting

**Considerations:**
- Visible track may not suit all styles
- Requires professional installation
- Individual fixture adjustment
- Good for highlighting collections
- Contemporary aesthetic

### Pendant Lights

**Features:**
- Decorative and functional
- Focal point for design
- Various styles available
- Hangs over work surface
- Statement piece options

**Best Uses:**
- Task lighting over bar
- Decorative focal points
- Traditional and modern styles
- Island or peninsula bars
- Visual interest

**Considerations:**
- Height adjustment important
- Size should match bar scale
- Multiple for larger bars
- Style defines personality
- Wide variety of designs

### Under-Cabinet Lighting

**Features:**
- Direct task illumination
- Concealed installation
- No shadows on workspace
- LED strip or puck options
- Professional appearance

**Best Uses:**
- Work surface task lighting
- Reading labels and measuring
- Eliminating shadows
- Mixed drink preparation
- Practical functionality

**Considerations:**
- Essential for functional bar
- Choose warm but bright LEDs
- Professional installation recommended
- Dimmable for flexibility
- Long LED strip life

### LED Strip Lights

**Features:**
- Flexible and versatile
- Accent and ambient uses
- Color options available
- Easy installation
- Energy efficient

**Best Uses:**
- Shelf accent lighting
- Under-bar ambiance
- Display case illumination
- Decorative effects
- Custom lighting solutions

**Considerations:**
- Choose high-quality LED strips
- Warm white for bars
- Professional color rendering
- Dimmable options available
- Easy DIY installation

### Wall Sconces

**Features:**
- Decorative wall-mounted fixtures
- Ambient and accent roles
- Various styles available
- Frame the bar area
- Add architectural interest

**Best Uses:**
- Ambient side lighting
- Decorative wall features
- Frame bar installation
- Traditional design aesthetics
- Symmetrical arrangements

**Considerations:**
- Placement at eye level or above
- Size appropriate to wall
- Match overall design style
- Consider symmetry
- Provide warm ambient glow

### Accent Spotlights

**Features:**
- Focused directional light
- High intensity beams
- Dramatic highlighting
- Professional gallery effect
- Adjustable direction

**Best Uses:**
- Highlighting specific bottles
- Showcasing displays
- Creating focal points
- Dramatic accent lighting
- Collection presentation

**Considerations:**
- Use sparingly for impact
- Highlight special pieces
- Create visual interest
- Professional installation
- Adjustable for flexibility

## Practical Lighting Solutions

### Dimmable Controls

**Why It Matters:**
- Adapt lighting to different occasions
- Create different moods
- From bright work mode to ambient
- Control energy consumption
- Professional bar flexibility

**Installation:**
- Dimmers on all major circuits
- Smart dimmer compatibility
- Multiple control points
- Central control system option
- App-based control for smart homes

**Usage Scenarios:**
- Bright for cocktail-making
- Dim for socializing
- Very dim for late-night ambiance
- Adaptive throughout evening
- Match activity to lighting

### Smart Lighting Systems

**Advantages:**
- Remote control from phone
- Scheduling and automation
- Color temperature control
- Scene setting for moods
- Integration with smart home

**Best Systems:**
- Hue for color options
- Lutron for professional quality
- WiZ for budget-friendly
- Nest for integration
- Custom smart systems

**Integration:**
- Voice control with assistants
- Motion sensor activation
- Sunset and sunrise routines
- Party mode settings
- Away mode automation

### Emergency and Backup Lighting

**Safety Considerations:**
- Backup power for safety
- Exit path illumination
- Emergency lighting requirements
- Battery backup systems
- Never leave guests in dark

**Solutions:**
- Battery-operated backup lights
- Emergency exit lighting
- Generator backup option
- Solar charged emergency lights
- Rechargeable portable lights

## Layered Lighting Strategy

### Planning Your Layout

**Assessment Phase:**
- Current natural light sources
- Bar location in room
- Existing electrical infrastructure
- Usage patterns and needs
- Design aesthetic goals

**Design Phase:**
- Ambient layer planning
- Task lighting placement
- Accent lighting highlights
- Decorative fixture selection
- Control system design

**Implementation:**
- Professional consultation
- Electrical work by licensed electrician
- Strategic fixture placement
- Testing and adjustment
- Final fine-tuning

### Zonal Lighting Approach

**Work Zone:**
- Task lighting for mixing
- Bright, focused illumination
- Minimal shadows on surface
- Accurate color rendering
- Safety-focused brightness

**Display Zone:**
- Accent lighting for collections
- Highlight special bottles
- Label visibility
- Professional presentation
- Dramatic focal points

**Ambient Zone:**
- General room illumination
- Warm, welcoming glow
- Even distribution
- Dimmable for mood
- Foundation lighting

### Balancing Layers

**Creating Harmony:**
- All layers work together
- No single layer dominates
- Smooth transitions between areas
- Consistent color temperature
- Unified design vision

**Testing and Adjustment:**
- Try different combinations
- Adjust fixture angles
- Test at different times
- Get feedback from users
- Fine-tune over time

## Common Lighting Mistakes

### Over-Lighting

**Problem:**
- Too bright overall
- Harsh and uncomfortable
- No sense of ambiance
- Feels commercial or clinical
- Wastes energy

**Solution:**
- Reduce number of fixtures
- Use dimmers everywhere
- Layer lighting carefully
- Create contrast and depth
- Embrace darker areas

### Under-Lighting Workspace

**Problem:**
- Can't see labels clearly
- Shadows on work surface
- Difficult to measure accurately
- Safety concerns
- Frustrating cocktail-making

**Solution:**
- Dedicated task lighting
- Under-cabinet illumination
- Bright focused spot
- Eliminate shadows
- Prioritize work area

### Inconsistent Color Temperature

**Problem:**
- Mix of warm and cool lights
- Unpleasant color shifts
- Looks amateur
- Uncomfortable viewing
- Lacks cohesive design

**Solution:**
- Consistent temperature throughout
- Warm for ambient (2700K-3000K)
- Neutral for task (3500K-4000K)
- Choose one and stick with it
- Quality fixtures matter

### Ignoring Dimming

**Problem:**
- No flexibility in brightness
- Can't adapt to different uses
- Limited mood options
- Wastes energy
- Less functional bar

**Solution:**
- Dimmer on every circuit
- Control at multiple points
- Smart dimmer systems
- Preset scene control
- Professional control systems

## Budget-Friendly Options

### Cost-Effective Solutions

**Affordable Fixtures:**
- Basic LED strips for accent
- Simple pendant lights
- Battery-operated puck lights
- Repurpose existing fixtures
- DIY installation where safe

**Gradual Investment:**
- Start with essential task lighting
- Add ambient layer next
- Accents added over time
- Upgrade fixtures gradually
- Build complete system

### DIY Approaches

**Safe DIY Options:**
- LED strip installation
- Battery-powered fixtures
- Simple pendant hanging
- Plug-in solutions
- String light arrangements

**Professional Required:**
- Wiring and electrical work
- Recessed light installation
- Smart home integration
- Complex switching
- Permits and code compliance

## Conclusion

Great home bar lighting is about creating the perfect balance between ambiance and function. The right lighting makes your bar feel inviting and professional while ensuring you can work efficiently and safely. Layered lighting with ambient, task, and accent components creates depth and interest while serving practical needs.

**Key Principles:**
- Layer ambient, task, and accent lighting
- Use warm color temperatures for atmosphere
- Prioritize quality task lighting
- Install dimmer controls for flexibility
- Balance aesthetics with function

**Remember:**
- Good lighting enhances experience
- Safety requires proper task lighting
- Ambiance creates memorable moments
- Quality fixtures are worth investment
- Lighting should adapt to different uses

Invest in thoughtful lighting design for your home bar. Proper illumination transforms your space from merely functional to truly exceptional, creating the perfect environment for enjoying great cocktails and entertaining guests. Cheers to well-lit bartending!`;

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
