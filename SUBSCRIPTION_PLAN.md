# 💎 Elixiary AI - Subscription Plan & Implementation

## 🎯 Updated Freemium Model

### **Free Tier (Forever Free)**
**Monthly Limits:**
- ✅ 10 recipe generations per month
- ✅ Save up to 20 recipes
- ✅ Text-only recipes (Gemini 2.5 Flash)
- ✅ Shopping list generation
- ✅ Tags & collections
- ✅ Search & filter
- ❌ No image generation
- ❌ No PDF export
- ❌ No advanced customization

---

### **Pro Tier - Regular Price: $4.99/month**

#### 🔥 Launch Offer (First 50 Users Only)
**Monthly Plan:**
- ~~$4.99/month~~ → **$1.49/month** (70% OFF)
- Valid for first 3 months
- Then $4.99/month after
- Cancel anytime

**Annual Plan (Best Value):**
- ~~$49/year~~ → **$14.99/year** (70% OFF first year)
- Then $49/year after first year
- Saves $2.89 vs monthly even with discount
- 30-day money-back guarantee

**Pro Features (Unlimited):**
- ✅ **Unlimited recipe generations**
- ✅ **Unlimited saved recipes**
- ✅ **AI-generated cocktail images** (Gemini Imagen/Vision)
- ✅ **PDF export** with beautiful formatting
- ✅ **Advanced customization** (complexity, dietary restrictions, flavor profiles)
- ✅ **Ingredient substitution suggestions** (unlimited access)
- ✅ **Recipe history & analytics**
- ✅ **Priority support** (email within 24h)
- ✅ **Early access** to new features
- ✅ **Custom recipe URLs** for sharing
- ✅ **No limits badge** on profile

---

## 💰 Pricing Structure

### Current Implementation
```
Free Tier:
- Price: $0
- Recipe Generation: 10/month
- Saved Recipes: 20 max
- Images: None
- Features: Basic

Pro Tier (After 50 users):
- Monthly: $4.99/month
- Annual: $49/year ($4.08/month, 18% off)
- Recipe Generation: Unlimited
- Saved Recipes: Unlimited
- Images: Unlimited (Gemini)
- Features: All

Pro Tier (First 50 users - Launch Offer):
- Monthly: $1.49/month (first 3 months, then $4.99)
- Annual: $14.99/year (first year, then $49/year)
- Same Pro features
- Countdown badge: "X/50 spots left"
- Urgency messaging
```

---

## 🛠️ Technical Stack

### Payment Processing
- **Stripe** (2.9% + $0.30 per transaction)
- Stripe Customer Portal for self-service billing
- Webhook handlers for subscription events

### Image Generation
- **Gemini Imagen 3** (via Vertex AI or Google AI API)
- Estimated cost: ~$0.04-0.08 per image
- Fallback: Use Gemini 2.0 Flash for image understanding + Imagen

### Database (Firestore)
```
users/{userId}
├── subscriptionTier: "free" | "pro"
├── subscriptionStatus: "active" | "trialing" | "past_due" | "canceled" | "incomplete"
├── stripeCustomerId: string
├── stripeSubscriptionId: string
├── stripePriceId: string (to track early bird vs regular)
├── isEarlyBird: boolean (first 50 users)
├── earlyBirdNumber: number (1-50)
├── subscriptionStartDate: timestamp
├── currentPeriodStart: timestamp
├── currentPeriodEnd: timestamp
├── cancelAtPeriodEnd: boolean
├── recipesGeneratedThisMonth: number
├── lastGenerationResetDate: timestamp
├── totalRecipesGenerated: number
├── recipeCount: number (saved recipes)
└── createdAt: timestamp
```

---

## 📋 Implementation Checklist

### **Phase 1: Foundation & Tracking (Days 1-2)**

#### Database Schema
- [ ] Create Firestore security rules for subscription data
- [ ] Add subscription fields to user document on signup
- [ ] Create Cloud Function to reset monthly generation counter (runs 1st of each month)
- [ ] Add usage tracking to recipe generation flow

#### Usage Counter System
- [ ] Track `recipesGeneratedThisMonth` on each generation
- [ ] Track `recipeCount` on save/delete
- [ ] Add counter reset logic (monthly)
- [ ] Create utility functions: `canGenerateRecipe()`, `canSaveRecipe()`

#### User Dashboard (My Account Page)
- [ ] Create `/account` page
- [ ] Show current tier (Free or Pro)
- [ ] Show usage stats: "X/10 recipes this month" (Free) or "Unlimited ✨" (Pro)
- [ ] Show "X/20 saved recipes" (Free) or "Unlimited ✨" (Pro)
- [ ] Show next reset date for free users
- [ ] Add "Upgrade to Pro" CTA for free users

---

### **Phase 2: Feature Gating & UI (Days 2-3)**

#### Recipe Generation Limits
- [ ] Check user tier before generation
- [ ] Block generation if free user at 10/month limit
- [ ] Show upgrade modal when limit hit
- [ ] Decrement counter on failed generations (rollback)
- [ ] Update recipe generation form to show counter: "X/10 left this month"

#### Recipe Save Limits
- [ ] Check recipe count before saving
- [ ] Block save if free user at 20 recipes
- [ ] Show upgrade modal when limit hit
- [ ] Show counter in "My Recipes": "X/20 recipes saved"

#### Upgrade Modals/CTAs
- [ ] Create `<UpgradeModal>` component
- [ ] Show different messages based on limit type (generation vs save)
- [ ] Add countdown: "X/50 early bird spots left"
- [ ] Show pricing comparison: Regular vs Early Bird
- [ ] Add urgency elements: "Limited time offer"
- [ ] Include testimonials/social proof (mock initially)

#### Pro Badges & Visual Indicators
- [ ] Add "PRO" badge to user avatar in header (if pro)
- [ ] Add "🔓 Unlimited" indicators throughout UI for pro users
- [ ] Add "🔒 Pro Feature" badges on locked features
- [ ] Show upgrade prompt tooltips on hover over locked features

---

### **Phase 3: Stripe Integration (Days 3-5)**

#### Stripe Setup
- [ ] Create Stripe account (or use existing)
- [ ] Add Stripe API keys to environment variables (Vercel + local .env.local)
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- [ ] Install Stripe SDK: `npm install stripe @stripe/stripe-js`

#### Stripe Products & Prices
- [ ] Create Pro product in Stripe Dashboard
- [ ] Create early bird prices:
  - Monthly: $1.49/month (with phase to $4.99 after 3 months)
  - Annual: $14.99/year (with phase to $49/year after 1 year)
- [ ] Create regular prices (for after 50 users):
  - Monthly: $4.99/month
  - Annual: $49/year
- [ ] Note all Price IDs for code

#### Checkout Flow
- [ ] Create `/api/stripe/create-checkout-session` API route
- [ ] Pass user ID, email, selected price, early bird status
- [ ] Create Stripe Checkout session with:
  - Success URL: `/account?success=true`
  - Cancel URL: `/account?canceled=true`
  - Customer email pre-filled
  - Trial period: none (direct charge)
- [ ] Create `/pricing` page with plans
- [ ] Add "Upgrade to Pro" buttons throughout app
- [ ] Implement client-side redirect to Checkout

#### Webhook Handler
- [ ] Create `/api/stripe/webhook` API route
- [ ] Verify webhook signature
- [ ] Handle events:
  - `checkout.session.completed` → Activate subscription, update Firestore
  - `customer.subscription.updated` → Update subscription status
  - `customer.subscription.deleted` → Downgrade to free tier
  - `invoice.payment_succeeded` → Extend subscription period
  - `invoice.payment_failed` → Mark past_due, send notification
- [ ] Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

#### Customer Portal
- [ ] Enable Stripe Customer Portal in dashboard
- [ ] Create `/api/stripe/create-portal-session` API route
- [ ] Add "Manage Billing" button in `/account` page
- [ ] Allow users to:
  - Update payment method
  - View invoices
  - Cancel subscription
  - Download receipts

---

### **Phase 4: Early Bird System (Day 5)**

#### Early Bird Counter
- [ ] Create Firestore collection: `config/earlyBird`
  - `count: number` (0-50)
  - `isActive: boolean`
- [ ] Increment counter on successful Pro signup
- [ ] Check counter before showing early bird pricing
- [ ] When count reaches 50: disable early bird, show regular pricing

#### UI Updates
- [ ] Show "X/50 spots left" in real-time on pricing page
- [ ] Update button text: "Claim Early Bird Spot" vs "Upgrade to Pro"
- [ ] Show "Early Bird Member #X" badge for early users
- [ ] Add urgency timer: "Offer expires in X hours" (optional)
- [ ] Celebrate when user joins: "You're Early Bird #X! 🎉"

#### Email Notifications (Optional for MVP)
- [ ] Welcome email on signup
- [ ] Payment confirmation email
- [ ] Upgrade confirmation with early bird details
- [ ] Cancellation confirmation
- [ ] Approaching limit warnings (8/10 recipes used)

---

### **Phase 5: Pro Features (Days 6-8)**

#### Image Generation (Gemini)
- [ ] Research Gemini Imagen 3 API (via Vertex AI)
- [ ] Add to genkit config if possible, or use separate API call
- [ ] Create new flow: `generate-cocktail-image.ts`
- [ ] Input: recipe name, description, ingredients
- [ ] Output: base64 image or URL
- [ ] Add "Generate Image" button to recipe cards (Pro only)
- [ ] Show loading state during image generation
- [ ] Save image URL to recipe document in Firestore
- [ ] Display image in recipe card and full view

#### PDF Export
- [ ] Install: `npm install jspdf jspdf-autotable`
- [ ] Create utility: `lib/pdf-exporter.ts`
- [ ] Design PDF template:
  - Recipe name as title
  - Image (if available)
  - Ingredients list
  - Instructions
  - Garnish & tips
  - Footer: "Generated by Elixiary AI"
- [ ] Add "Export PDF" button to recipe full view (Pro only)
- [ ] Trigger download on click

#### Advanced Customization
- [ ] Add "Customize" button in recipe generation form (Pro only)
- [ ] Create customization modal with options:
  - Complexity level: Simple, Moderate, Complex
  - Dietary restrictions: Vegan, Low-sugar, Alcohol-free, Gluten-free
  - Flavor profile sliders: Sweet, Sour, Bitter, Spicy, Fruity
- [ ] Pass customization parameters to AI prompt
- [ ] Update `generate-cocktail-recipe.ts` to accept custom params

#### Recipe History & Analytics
- [ ] Track generation history: save prompt, timestamp, result
- [ ] Create "History" tab in `/account` page
- [ ] Show stats:
  - Total recipes generated
  - Most used ingredients
  - Favorite glass types
  - Generation frequency chart (last 30 days)
- [ ] Allow re-generate from history

---

### **Phase 6: Polish & Testing (Days 8-9)**

#### UI/UX Polish
- [ ] Add loading states for all async operations
- [ ] Add error handling and user-friendly messages
- [ ] Add success toasts for upgrades, cancellations
- [ ] Test all upgrade flows (monthly, annual, early bird)
- [ ] Test all limit scenarios (hit 10/month, hit 20 saved)
- [ ] Mobile responsiveness check
- [ ] Dark mode check

#### Testing Checklist
- [ ] Test signup → free tier → hit limit → upgrade → unlimited
- [ ] Test monthly vs annual checkout
- [ ] Test early bird pricing (mock counter at 49, 50, 51)
- [ ] Test webhook events (use Stripe test mode)
- [ ] Test subscription cancellation → still has access until period end
- [ ] Test failed payment → downgrade to free
- [ ] Test image generation (Pro only)
- [ ] Test PDF export (Pro only)
- [ ] Test billing portal access

#### Security & Performance
- [ ] Ensure all API routes check authentication
- [ ] Validate user tier server-side (never trust client)
- [ ] Rate limit API routes
- [ ] Add error logging (Sentry or similar)
- [ ] Cache subscription status (reduce Firestore reads)
- [ ] Optimize image loading (use Next.js Image)

---

### **Phase 7: Pricing Page & Marketing (Days 9-10)**

#### Create `/pricing` Page
- [ ] Hero section: "Choose Your Mixology Journey"
- [ ] Two-column comparison: Free vs Pro
- [ ] Highlight early bird offer: "70% OFF - First 50 users only!"
- [ ] Add countdown: "X spots remaining"
- [ ] Feature comparison table
- [ ] FAQ section:
  - Can I cancel anytime? Yes
  - What happens after 3 months? Price goes to $4.99
  - Do I get to keep early bird pricing forever? First 3 months (monthly) or first year (annual)
  - Refund policy? 30-day money-back guarantee
  - What payment methods? All major cards via Stripe
- [ ] Testimonials section (mock/real)
- [ ] Add to header navigation

#### Social Proof Elements
- [ ] Add "🔥 X users upgraded today" (can be manual initially)
- [ ] Add "⭐ X recipes generated this week" counter
- [ ] Show avatar stack of Pro users (mock initially)
- [ ] Add trust badges: "Secure payment via Stripe", "30-day guarantee"

#### Email Sequences (Optional)
- [ ] Day 1: Welcome email
- [ ] Day 3: You've used 5/10 recipes - consider upgrading
- [ ] Day 7: You've used 10/10 - upgrade now
- [ ] Day 14: Don't forget your recipes reset in X days
- [ ] Day 30: Your monthly recipes have reset!

---

### **Phase 8: Launch Preparation (Day 10)**

#### Pre-Launch Checklist
- [ ] Switch Stripe to live mode (from test mode)
- [ ] Add live Stripe keys to Vercel environment variables
- [ ] Set early bird counter to 0 in production Firestore
- [ ] Test end-to-end with real payment (then refund)
- [ ] Prepare launch announcement:
  - Twitter/X post
  - Product Hunt submission
  - Reddit (r/SideProject, r/SaaS)
  - Email to existing users (if any)
- [ ] Create changelog/release notes
- [ ] Update README with Pro features
- [ ] Prepare customer support flow (email, FAQ)

#### Monitoring Setup
- [ ] Set up Stripe dashboard alerts for:
  - Failed payments
  - New subscriptions
  - Cancellations
- [ ] Set up analytics for:
  - Free → Pro conversion rate
  - Most common upgrade trigger (generation limit vs save limit)
  - Churn rate
  - MRR tracking

#### Launch Day
- [ ] Deploy to production
- [ ] Announce on all channels
- [ ] Monitor Stripe dashboard
- [ ] Monitor Firestore for errors
- [ ] Respond to user feedback quickly
- [ ] Celebrate first paying customer! 🎉

---

## 📊 Success Metrics & Goals

### Week 1 Goals
- [ ] 50 total signups (free tier)
- [ ] 5 Pro signups (10% conversion)
- [ ] $7.45 MRR (5 × $1.49)

### Month 1 Goals
- [ ] 200 total signups
- [ ] 20 Pro users (10% conversion)
- [ ] $100+ MRR
- [ ] Fill all 50 early bird spots

### Month 3 Goals
- [ ] 1,000 total signups
- [ ] 100 Pro users
- [ ] $500+ MRR (mix of early bird transitioning to $4.99 + new users)

### Month 6 Goals
- [ ] 5,000 total signups
- [ ] 250+ Pro users
- [ ] $1,250+ MRR

---

## 💡 Post-Launch Optimizations

### A/B Testing Ideas
- [ ] Test pricing: $4.99 vs $6.99 vs $9.99
- [ ] Test free tier limit: 10 vs 15 vs 5 recipes
- [ ] Test early bird discount: 70% vs 50% vs 80%
- [ ] Test CTA copy: "Upgrade Now" vs "Go Pro" vs "Unlock Unlimited"

### Feature Requests to Track
- [ ] Ingredient inventory (track what you have at home)
- [ ] Recipe ratings & reviews
- [ ] Community sharing (public recipe gallery)
- [ ] Meal planning (schedule cocktails for events)
- [ ] Barware recommendations

### Growth Experiments
- [ ] Referral program: Give 1 month free for each paying referral
- [ ] Lifetime deal: $199 one-time (limited to 10 users)
- [ ] Team plans: $14.99/month for 3 users
- [ ] White-label for bars/restaurants

---

## 🚨 Risk Mitigation

### If Early Bird Doesn't Fill
- [ ] Extend offer to first 100 users
- [ ] Add time limit: "Expires in 7 days"
- [ ] Increase discount: 80% off instead of 70%

### If Churn is High
- [ ] Survey canceling users
- [ ] Add exit interview: "What could we improve?"
- [ ] Offer pause subscription (1-3 months)
- [ ] Win-back campaign: 50% off for 3 months

### If Free Users Don't Convert
- [ ] Reduce free tier: 5 recipes instead of 10
- [ ] Add more Pro-only features
- [ ] Better upgrade messaging
- [ ] Add video tutorials showing Pro features

---

## 📝 Notes

- **Image Generation Note:** Gemini Imagen 3 is available via Vertex AI. If not accessible via free tier, we may need to:
  1. Wait for Gemini 2.0 Flash multimodal with better image generation
  2. Use text-to-image prompts with Gemini to generate descriptive prompts, then use free tier Stable Diffusion
  3. Defer image generation to post-MVP

- **Stripe vs Lemon Squeezy:** Sticking with Stripe for better developer experience and ecosystem.

- **Tax Handling:** Stripe automatically calculates and collects sales tax/VAT if enabled in settings. Recommended to enable.

- **Testing:** Use Stripe test mode with test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## 🎯 Current Status: Planning Complete ✅

**Next Step:** Begin implementation starting with Phase 1 (Database Schema & Usage Tracking).

**Estimated Total Implementation Time:** 10 working days (2 weeks at steady pace)

**Ready to start?** Let's build this! 🚀

