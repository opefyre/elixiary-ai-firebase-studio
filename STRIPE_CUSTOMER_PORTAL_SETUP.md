# Stripe Customer Portal Setup Guide

## Issue
Getting a 500 error when clicking "Manage Billing" button.

## Cause
The Stripe Customer Portal is not yet activated in your Stripe Dashboard.

---

## ✅ Solution: Activate Customer Portal (2 minutes)

### Step 1: Go to Stripe Dashboard
Visit: https://dashboard.stripe.com/settings/billing/portal

(Or navigate: Dashboard → Settings → Billing → Customer portal)

### Step 2: Activate the Customer Portal
1. Click **"Activate"** or **"Turn on"** button
2. Review the default settings (they should be fine)
3. Click **"Save"** or **"Activate Customer Portal"**

### Step 3: Configure Portal Settings (Optional)

**Default Features** (all enabled):
- ✅ Update payment methods
- ✅ View invoices
- ✅ Cancel subscription
- ✅ Update subscription

**Recommended Settings**:
- **Headline**: "Manage Your Subscription"
- **Customer information**: Email only (default)
- **Allowed actions**:
  - ✅ Update payment method
  - ✅ View invoices and receipts
  - ✅ Cancel subscription
  - ⚠️ Pause subscription (optional - up to you)
  - ⚠️ Switch plans (optional - if you have multiple tiers)

**Cancellation Settings**:
- ✅ Allow immediate cancellation
- ✅ Show cancellation confirmation
- 📧 Send cancellation email (optional)
- ⚠️ Cancellation retention offer (optional - "Stay for 50% off?")

### Step 4: Save Configuration
Click **"Save"** at the bottom of the page.

---

## ✅ Test the Portal

After activation:

1. **Wait 1-2 minutes** for Vercel to redeploy
2. **Go to**: https://ai.elixiary.com/account
3. **Click**: "Manage Billing" button
4. **Expected**: Redirect to Stripe Customer Portal
5. **Verify**: You can see your subscription, payment methods, invoices

---

## 🎨 Portal Customization (Optional)

### Branding
You can customize the portal's appearance:
- **Logo**: Upload Elixiary AI logo
- **Brand color**: Match your app's theme
- **Font**: Choose a font that matches your brand

Go to: https://dashboard.stripe.com/settings/branding

---

## 🔒 Security Notes

- Customer Portal is secure and hosted by Stripe
- Users can only access their own data
- Sessions expire after 1 hour
- All actions are logged in Stripe

---

## 🚨 Common Issues

### Issue: "Portal session could not be created"
**Solution**: Make sure the Customer Portal is activated (Step 2 above)

### Issue: "Customer not found"
**Solution**: Check that the user has a valid Stripe customer ID in Firestore

### Issue: Portal shows in wrong language
**Solution**: Set default locale in Stripe settings → Customer portal → Language

---

## 📋 What Customers Can Do

Once activated, your Pro users can:

1. **Update Payment Method**
   - Add new card
   - Remove old card
   - Set default payment method

2. **View Billing History**
   - See all invoices
   - Download receipts (PDF)
   - View payment history

3. **Manage Subscription**
   - Cancel subscription (stays active until period end)
   - Resume canceled subscription
   - View next billing date
   - See subscription status

4. **Update Billing Info**
   - Update billing email
   - Update billing address
   - Update tax information

---

## ✅ Checklist

Before going live with Customer Portal:

- [ ] Customer Portal activated in Stripe Dashboard
- [ ] Default settings configured
- [ ] Branding/logo added (optional)
- [ ] Test with a test subscription
- [ ] Verify cancellation flow works
- [ ] Verify payment update works
- [ ] Check email notifications (optional)

---

## 🎯 After Activation

Once the portal is active, the "Manage Billing" button will:

1. Create a secure portal session
2. Redirect user to Stripe Customer Portal
3. User manages their subscription
4. User returns to your app (via return_url)
5. Changes sync automatically via webhooks

---

**Estimated Setup Time**: 2-5 minutes  
**Difficulty**: Easy  
**Required**: Yes (for Pro user self-service)

---

## 🚀 Quick Link

**Activate Now**: https://dashboard.stripe.com/settings/billing/portal

Then refresh your app and try "Manage Billing" again! ✨

