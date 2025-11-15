import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Sparkles } from 'lucide-react';
import { FreePlanAction, ProPlanActions } from './pricing-actions';

const PRO_PRICING = {
  monthly: { price: 2.49, original: null, period: 'month' as const },
  annual: { price: 23.88, original: null, period: 'year' as const },
};

export default function PricingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pt-safe md:py-12 md:pt-28">
      <div className="text-center mb-12">
        <h1 className="font-headline text-3xl font-bold md:text-4xl mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Start free, upgrade when you’re ready.
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto md:grid-cols-2">
        <Card className="relative">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-muted rounded-lg">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-xl">Free</CardTitle>
            <CardDescription>Perfect for trying out</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">forever</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>10 AI recipes per month</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Save up to 20 recipes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Browse curated recipes</span>
            </div>
          </CardContent>

          <CardFooter>
            <FreePlanAction />
          </CardFooter>
        </Card>

        <Card className="relative border-primary shadow-lg">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="gap-1 px-3 py-1 text-xs">
              <Crown className="h-3 w-3" />
              Most Popular
            </Badge>
          </div>

          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Crown className="h-5 w-5 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">Pro</CardTitle>
            <CardDescription>For cocktail enthusiasts</CardDescription>
            <div className="mt-4">
              <div className="text-3xl font-bold">$23.88</div>
              <p className="text-sm text-muted-foreground">per year • Save 20% annually</p>
              <p className="text-xs text-muted-foreground mt-1">Or $2.49 billed monthly</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-medium">Unlimited AI recipes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-medium">Unlimited saved recipes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Smart shopping lists</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>PDF export &amp; sharing</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>Gamified achievements</span>
            </div>
          </CardContent>

          <CardFooter>
            <ProPlanActions pricing={PRO_PRICING} />
          </CardFooter>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Secure payment via Stripe • Cancel anytime • No hidden fees
        </p>
      </div>
    </div>
  );
}
