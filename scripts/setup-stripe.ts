/**
 * Stripe Setup Script
 * 
 * This script creates all necessary Stripe products and prices for Elixiary AI
 * Run with: npx tsx scripts/setup-stripe.ts
 * 
 * Prerequisites:
 * 1. Set STRIPE_SECRET_KEY environment variable
 * 2. Run: npm install -g tsx (if not installed)
 */

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable not set');
  console.log('\nTo fix this:');
  console.log('1. Go to https://dashboard.stripe.com/test/apikeys');
  console.log('2. Copy your "Secret key" (starts with sk_test_)');
  console.log('3. Run: export STRIPE_SECRET_KEY=sk_test_your_key_here');
  console.log('4. Run this script again\n');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

async function setupStripeProducts() {
  console.log('🚀 Starting Stripe setup for Elixiary AI...\n');

  try {
    // Create Pro Product
    console.log('📦 Creating Pro product...');
    const product = await stripe.products.create({
      name: 'Elixiary AI Pro',
      description: 'Unlimited cocktail recipe generation, AI images, PDF export, and more',
      metadata: {
        app: 'elixiary-ai',
      },
    });
    console.log(`✅ Product created: ${product.id}\n`);

    // Create Early Bird Monthly Price (70% off for 3 months)
    console.log('💰 Creating Early Bird Monthly price ($1.49/mo for 3 months)...');
    const earlyBirdMonthly = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      unit_amount: 149, // $1.49
      nickname: 'Early Bird Monthly (70% OFF)',
      metadata: {
        type: 'early_bird',
        original_price: '499',
        discount: '70%',
        duration: '3_months',
      },
    });
    console.log(`✅ Early Bird Monthly: ${earlyBirdMonthly.id}`);
    console.log(`   Price: $${(earlyBirdMonthly.unit_amount! / 100).toFixed(2)}/month\n`);

    // Create Early Bird Annual Price (70% off for 1 year)
    console.log('💰 Creating Early Bird Annual price ($14.99/year)...');
    const earlyBirdAnnual = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      recurring: {
        interval: 'year',
        interval_count: 1,
      },
      unit_amount: 1499, // $14.99
      nickname: 'Early Bird Annual (70% OFF)',
      metadata: {
        type: 'early_bird',
        original_price: '4999',
        discount: '70%',
        duration: '1_year',
      },
    });
    console.log(`✅ Early Bird Annual: ${earlyBirdAnnual.id}`);
    console.log(`   Price: $${(earlyBirdAnnual.unit_amount! / 100).toFixed(2)}/year\n`);

    // Create Regular Monthly Price
    console.log('💰 Creating Regular Monthly price ($4.99/mo)...');
    const proMonthly = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      recurring: {
        interval: 'month',
        interval_count: 1,
      },
      unit_amount: 499, // $4.99
      nickname: 'Pro Monthly',
      metadata: {
        type: 'regular',
      },
    });
    console.log(`✅ Pro Monthly: ${proMonthly.id}`);
    console.log(`   Price: $${(proMonthly.unit_amount! / 100).toFixed(2)}/month\n`);

    // Create Regular Annual Price
    console.log('💰 Creating Regular Annual price ($49/year)...');
    const proAnnual = await stripe.prices.create({
      product: product.id,
      currency: 'usd',
      recurring: {
        interval: 'year',
        interval_count: 1,
      },
      unit_amount: 4900, // $49.00
      nickname: 'Pro Annual',
      metadata: {
        type: 'regular',
      },
    });
    console.log(`✅ Pro Annual: ${proAnnual.id}`);
    console.log(`   Price: $${(proAnnual.unit_amount! / 100).toFixed(2)}/year\n`);

    // Output summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Stripe setup complete! Here are your Price IDs:\n');
    console.log('Copy these to your Vercel environment variables:\n');
    console.log(`STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID=${earlyBirdMonthly.id}`);
    console.log(`STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID=${earlyBirdAnnual.id}`);
    console.log(`STRIPE_PRO_MONTHLY_PRICE_ID=${proMonthly.id}`);
    console.log(`STRIPE_PRO_ANNUAL_PRICE_ID=${proAnnual.id}`);
    console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (get from dashboard)`);
    console.log(`STRIPE_WEBHOOK_SECRET=whsec_... (get after webhook setup)\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Next steps
    console.log('📋 Next Steps:\n');
    console.log('1. Add the above environment variables to Vercel:');
    console.log('   - Go to: https://vercel.com/your-project/settings/environment-variables\n');
    console.log('2. Set up Stripe Webhook:');
    console.log('   - Go to: https://dashboard.stripe.com/test/webhooks');
    console.log('   - Click "Add endpoint"');
    console.log(`   - Endpoint URL: https://your-domain.vercel.app/api/stripe/webhook`);
    console.log('   - Select these events:');
    console.log('     * checkout.session.completed');
    console.log('     * customer.subscription.updated');
    console.log('     * customer.subscription.deleted');
    console.log('     * invoice.payment_succeeded');
    console.log('     * invoice.payment_failed');
    console.log('   - Copy the "Signing secret" (starts with whsec_)');
    console.log('   - Add it to Vercel as STRIPE_WEBHOOK_SECRET\n');
    console.log('3. Redeploy your app on Vercel\n');
    console.log('4. Test a checkout! 🎉\n');

    // Save to file
    const output = {
      productId: product.id,
      prices: {
        earlyBirdMonthly: earlyBirdMonthly.id,
        earlyBirdAnnual: earlyBirdAnnual.id,
        proMonthly: proMonthly.id,
        proAnnual: proAnnual.id,
      },
      envVars: {
        STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID: earlyBirdMonthly.id,
        STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID: earlyBirdAnnual.id,
        STRIPE_PRO_MONTHLY_PRICE_ID: proMonthly.id,
        STRIPE_PRO_ANNUAL_PRICE_ID: proAnnual.id,
      },
    };

    // Write to file
    const fs = await import('fs');
    fs.writeFileSync(
      'stripe-config.json',
      JSON.stringify(output, null, 2)
    );
    console.log('💾 Configuration saved to stripe-config.json\n');

  } catch (error: any) {
    console.error('❌ Error setting up Stripe:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n⚠️  Your Stripe API key may be invalid or expired');
      console.log('Please check: https://dashboard.stripe.com/test/apikeys\n');
    }
    process.exit(1);
  }
}

// Run the setup
setupStripeProducts();

