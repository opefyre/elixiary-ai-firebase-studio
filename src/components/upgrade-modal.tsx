'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Image, FileText, Sliders, Zap } from 'lucide-react';
import Link from 'next/link';

export type UpgradeReason = 
  | 'generation_limit' 
  | 'save_limit' 
  | 'image_generation' 
  | 'pdf_export'
  | 'advanced_customization';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: UpgradeReason;
}

const reasonConfig = {
  generation_limit: {
    title: "You've Used All Free Recipes This Month",
    description: "Upgrade to Pro for unlimited recipe generations and never hit a limit again.",
    icon: Zap,
    features: [
      "Unlimited recipe generations every month",
      "Save unlimited recipes",
      "AI-generated cocktail images",
      "PDF export with beautiful formatting",
    ],
  },
  save_limit: {
    title: "Recipe Storage Limit Reached",
    description: "You've saved 20 recipes. Upgrade to Pro for unlimited storage.",
    icon: Sparkles,
    features: [
      "Save unlimited recipes",
      "Unlimited recipe generations",
      "Organize with advanced tags & collections",
      "Export recipes as PDF",
    ],
  },
  image_generation: {
    title: "AI-Generated Images - Pro Feature",
    description: "Generate beautiful AI cocktail images to bring your recipes to life.",
    icon: Image,
    features: [
      "AI-generated cocktail images (Gemini Imagen)",
      "Unlimited recipe generations",
      "Save unlimited recipes",
      "PDF export with images",
    ],
  },
  pdf_export: {
    title: "PDF Export - Pro Feature",
    description: "Export your cocktail recipes as beautiful PDFs to print or share.",
    icon: FileText,
    features: [
      "Export recipes as beautifully formatted PDFs",
      "Include AI-generated images in exports",
      "Unlimited recipe generations",
      "Save unlimited recipes",
    ],
  },
  advanced_customization: {
    title: "Advanced Customization - Pro Feature",
    description: "Fine-tune recipes with advanced options like dietary restrictions and complexity levels.",
    icon: Sliders,
    features: [
      "Advanced recipe customization options",
      "Dietary restriction filters",
      "Complexity level control",
      "Flavor profile adjustments",
    ],
  },
};

export function UpgradeModal({ open, onOpenChange, reason = 'generation_limit' }: UpgradeModalProps) {
  const config = reasonConfig[reason];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Pro Features Include:</span>
            </div>
            <ul className="space-y-2 text-sm">
              {config.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Limited Time Offer
            </div>
            <div className="text-2xl font-bold mb-1">
              <span className="line-through text-muted-foreground text-lg mr-2">$4.99</span>
              $1.49/month
            </div>
            <div className="text-xs text-muted-foreground">
              🔥 70% off for first 50 users • First 3 months
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button size="lg" className="w-full" asChild>
            <Link href="/pricing" onClick={() => onOpenChange(false)}>
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro Now
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

