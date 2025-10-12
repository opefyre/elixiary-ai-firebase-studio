'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface FeatureUpgradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
  featureIcon?: React.ReactNode;
}

export function FeatureUpgradeDialog({ 
  isOpen, 
  onClose, 
  featureName,
  featureDescription,
  featureIcon 
}: FeatureUpgradeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-4">
            {featureIcon || <Crown className="h-8 w-8 text-white fill-current" />}
          </div>
          <DialogTitle className="text-center text-2xl">
            Unlock {featureName}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {featureDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits */}
          <div className="bg-gradient-to-br from-primary/5 to-yellow-500/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Unlimited recipe generations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">Unlimited saved recipes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">{featureName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm">PDF export & more</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold">$1.49</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              70% OFF - Limited time
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Button 
              size="lg" 
              className="w-full gap-2" 
              asChild
            >
              <Link href="/pricing">
                <Crown className="h-4 w-4" />
                Upgrade to Pro
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full" 
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Signals */}
          <p className="text-center text-xs text-muted-foreground">
            ✨ Cancel anytime • 🔒 Secure payment • 💳 No hidden fees
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

