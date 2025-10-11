# 🎯 Stripe Setup Guide for Elixiary AI

This guide will walk you through setting up Stripe payments for your app in **under 15 minutes**.

---

## 📋 Prerequisites

- Stripe account (free): https://dashboard.stripe.com/register
- Access to your Vercel project
- Terminal access to run scripts

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Stripe API Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Secret key** (starts with `sk_test_...`)
3. Copy your **Publishable key** (starts with `pk_test_...`)

---

### Step 2: Create Products & Prices (Automated)

Run the automated setup script:

```bash
# Install tsx if you don't have it
npm install -g tsx

# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_test_your_key_here

# Run the setup script
npx tsx scripts/setup-stripe.ts
```

The script will:
- ✅ Create "Elixiary AI Pro" product
- ✅ Create 4 price points (early bird + regular, monthly + annual)
- ✅ Output all Price IDs you need
- ✅ Save configuration to `stripe-config.json`

**Expected Output:**
```
✨ Stripe setup complete! Here are your Price IDs:

STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID=price_abc123
STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID=price_def456
STRIPE_PRO_MONTHLY_PRICE_ID=price_ghi789
STRIPE_PRO_ANNUAL_PRICE_ID=price_jkl012
```

---

### Step 3: Add Environment Variables to Vercel

1. Go to: https://vercel.com/your-project/settings/environment-variables

2. Add these variables (use values from Step 2):

```
STRIPE_SECRET_KEY=sk_test_... (from Step 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (from Step 1)
STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID=price_... (from script output)
STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID=price_... (from script output)
STRIPE_PRO_MONTHLY_PRICE_ID=price_... (from script output)
STRIPE_PRO_ANNUAL_PRICE_ID=price_... (from script output)
```

3. **Important:** Set these for **Production** environment

---

## 🔗 Step 4: Set Up Webhook

Webhooks allow Stripe to notify your app about payment events.

### 4.1: Create Webhook Endpoint

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://your-domain.vercel.app/api/stripe/webhook
   ```
   Replace `your-domain` with your actual Vercel domain (e.g., `ai.elixiary.com`)

### 4.2: Select Events

Select these 5 events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

### 4.3: Get Signing Secret

1. After creating the endpoint, click on it
2. Click **"Reveal"** next to "Signing secret"
3. Copy the secret (starts with `whsec_...`)
4. Add it to Vercel:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## 🧪 Step 5: Test Your Setup

### 5.1: Redeploy on Vercel

After adding all environment variables, trigger a redeploy:
- Go to Vercel → Deployments
- Click on latest deployment → "..." → "Redeploy"

### 5.2: Test Checkout Flow

1. Go to your deployed app
2. Click "Upgrade to Pro" or visit `/pricing`
3. Click on Monthly or Annual plan
4. Use Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Expiry: Any future date
   CVC: Any 3 digits
   ZIP: Any 5 digits
   ```
5. Complete checkout
6. Verify you're upgraded to Pro in `/account`

### 5.3: Verify Webhook

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Check "Attempts" tab - should show successful events

---

## 📊 What Each Price ID Does

| Variable | Purpose | Price | Duration |
|----------|---------|-------|----------|
| `STRIPE_EARLY_BIRD_MONTHLY_PRICE_ID` | First 50 users monthly | $1.49/mo | 3 months → $4.99 |
| `STRIPE_EARLY_BIRD_ANNUAL_PRICE_ID` | First 50 users annual | $14.99/yr | 1 year → $49 |
| `STRIPE_PRO_MONTHLY_PRICE_ID` | Regular monthly | $4.99/mo | Forever |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | Regular annual | $49/yr | Forever |

---

## 🔧 Troubleshooting

### Issue: "STRIPE_SECRET_KEY not configured"
**Solution:** Make sure you added the env var to Vercel and redeployed

### Issue: Webhook returns 400 error
**Solution:** Check that `STRIPE_WEBHOOK_SECRET` is set correctly in Vercel

### Issue: Checkout button doesn't work
**Solution:** Check browser console for errors. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

### Issue: Payment succeeds but user not upgraded
**Solution:** Check webhook logs in Stripe dashboard. Verify webhook events are enabled

### Issue: "Invalid price ID"
**Solution:** Double-check the Price IDs in Vercel match the ones from the script output

---

## 🎓 Understanding Stripe Events

| Event | What It Does |
|-------|-------------|
| `checkout.session.completed` | User completes payment → Upgrade to Pro |
| `customer.subscription.updated` | Subscription changes → Update Firebase |
| `customer.subscription.deleted` | User cancels → Downgrade to Free |
| `invoice.payment_succeeded` | Monthly/Annual renewal successful |
| `invoice.payment_failed` | Payment failed → Mark as past_due |

---

## 🔐 Security Notes

- ✅ Never commit API keys to Git
- ✅ Use test mode (`sk_test_`, `pk_test_`) until ready
- ✅ Webhook secret verifies requests are from Stripe
- ✅ Metadata links Stripe customers to Firebase users

---

## 🚀 Going Live (Production)

When ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard
2. Get **Live API keys** from: https://dashboard.stripe.com/apikeys
3. Create **new webhook** for production domain
4. Update Vercel env vars with **live keys**
5. Redeploy
6. Test with a real card (you can refund immediately)

---

## 📞 Need Help?

- Stripe Docs: https://stripe.com/docs
- Webhook Testing: Use Stripe CLI (`stripe trigger checkout.session.completed`)
- Stripe Dashboard: https://dashboard.stripe.com

---

## ✅ Checklist

Before launching:
- [ ] All 7 environment variables added to Vercel
- [ ] Webhook endpoint created and verified
- [ ] Test checkout completes successfully
- [ ] User upgraded to Pro after payment
- [ ] Webhook shows successful events in dashboard
- [ ] Account page shows Pro status
- [ ] Unlimited features work (generation, saves)

---

## 💡 Quick Commands

```bash
# Run Stripe setup
npx tsx scripts/setup-stripe.ts

# Test webhook locally (requires Stripe CLI)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Trigger test event
stripe trigger checkout.session.completed

# View webhook logs
stripe logs tail
```

---

**That's it! You're ready to accept payments! 🎉**

