# 🔄 Complete Reset Guide - Clean Slate

**Purpose**: Remove all test subscriptions, customers, and data from Stripe and Firebase.

---

## 🎯 Step-by-Step Reset Process

### Step 1: Cancel All Stripe Subscriptions (2 minutes)

#### Option A: Bulk Cancel via Stripe Dashboard (Fastest)

1. **Go to**: https://dashboard.stripe.com/test/subscriptions
2. **For each subscription**:
   - Click the checkbox next to each subscription
   - Click "Actions" → "Cancel subscriptions"
   - Choose "Cancel immediately"
   - Confirm

**OR** do it one by one:

1. **Go to**: https://dashboard.stripe.com/test/subscriptions
2. **Find your subscriptions** (filter by email: opefyre@gmail.com)
3. **For each subscription**:
   - Click on it
   - Click "Cancel subscription" (top right)
   - Choose "Cancel immediately" (not "at period end")
   - Confirm

---

### Step 2: Delete All Stripe Customers (Optional but Recommended)

1. **Go to**: https://dashboard.stripe.com/test/customers
2. **Find customer** for opefyre@gmail.com
3. **Click on the customer**
4. **Click "..." menu** (top right)
5. **Click "Delete customer"**
6. **Confirm deletion**

**Why delete customers?**
- Removes all payment methods
- Removes all billing history
- Fresh start for testing
- No confusion with old data

---

### Step 3: Clean Firebase Firestore User Document

1. **Go to**: https://console.firebase.google.com/project/studio-1063505923-cbb37/firestore
2. **Navigate to**: `users` collection
3. **Find your user**: `uzyFZtgGRAZZUlqc3j7c42PUHgk1`
4. **Click on the document**
5. **Delete subscription-related fields**:
   - Delete `stripeCustomerId`
   - Delete `stripeSubscriptionId`
   - Delete `stripePriceId`
   - Delete `subscriptionTier` (or set to "free")
   - Delete `subscriptionStatus` (or set to "active")
   - Delete `isEarlyBird`
   - Delete `earlyBirdNumber`
   - Delete `subscriptionStartDate`
   - Delete `currentPeriodStart`
   - Delete `currentPeriodEnd`
   - Delete `cancelAtPeriodEnd`

**OR** even simpler:

6. **Delete the entire user document**:
   - Click "Delete document"
   - Confirm
   - The app will recreate it as a free user when you sign in

---

### Step 4: Reset Early Bird Counter (Optional)

If you want to reset the early bird counter to 0:

1. **In Firebase Console**: Firestore
2. **Navigate to**: `config` → `earlyBird`
3. **Update fields**:
   - Set `count` to `0`
   - Set `isActive` to `true`

---

### Step 5: Sign Out and Sign In

1. **Go to**: https://ai.elixiary.com
2. **Sign out** (click your name, then sign out)
3. **Sign in again**
4. **Go to**: https://ai.elixiary.com/account
5. **Verify**: You see "Free Plan" (not Pro)

---

## 🧹 Automated Cleanup Script (Advanced)

If you want to automate this, I can create a script, but manual cleanup via dashboards is safer for now.

---

## ✅ Verification Checklist

After cleanup, verify:

- [ ] No active subscriptions in Stripe
- [ ] Customer deleted in Stripe (or has no subscriptions)
- [ ] Firebase user document shows "free" tier
- [ ] Account page shows "Free Plan"
- [ ] Pricing page shows "Upgrade" button
- [ ] Early bird counter reset to 0 (if desired)

---

## 🧪 Test the Clean System

After cleanup:

1. **Verify free tier**:
   - Go to /account
   - Should show "Free Plan"
   - Should show "10/10 generations remaining"
   - Should show "0/20 recipes saved"

2. **Test upgrade (fresh)**:
   - Go to /pricing
   - Click "Upgrade to Pro - Monthly"
   - Complete checkout with test card
   - Verify only 1 subscription created
   - Go to account page, shows "Pro Member"

3. **Test duplicate prevention**:
   - Go to /pricing again
   - Try to click "Upgrade" again
   - Should see error: "You already have an active subscription"
   - Verify still only 1 subscription in Stripe

---

## 🎯 Quick Links

**Stripe Subscriptions**: https://dashboard.stripe.com/test/subscriptions  
**Stripe Customers**: https://dashboard.stripe.com/test/customers  
**Firebase Firestore**: https://console.firebase.google.com/project/studio-1063505923-cbb37/firestore  

---

## ⏱️ Estimated Time

- Cancel 6 subscriptions: 2-3 minutes
- Delete customer: 30 seconds
- Clean Firebase document: 1 minute
- Verify + test: 2 minutes

**Total**: ~5-7 minutes for complete clean slate

---

## 💡 Tips

1. **Use Customer Portal** for fastest cancellation (cancel all at once)
2. **Delete entire user document** in Firebase for cleanest reset
3. **Keep early bird counter at 0** for fresh testing
4. **After cleanup, do ONE test purchase** to verify everything works

---

## 🚨 Important

- All these are **test subscriptions** (no real money)
- Safe to delete everything
- The duplicate prevention is now active
- Real users won't have this issue

---

**After cleanup, your system will be in perfect condition for production launch!** ✨

