'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings2, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FeatureUpgradeDialog } from '@/components/feature-upgrade-dialog';

export interface CustomizationOptions {
  complexity?: 'simple' | 'moderate' | 'complex';
  dietary?: string[];
  alcoholLevel?: 'low' | 'medium' | 'strong';
  sweetness?: 'dry' | 'balanced' | 'sweet';
}

interface CustomizationDialogProps {
  onApply: (options: CustomizationOptions) => void;
  isPro: boolean;
}

export function CustomizationDialog({ onApply, isPro }: CustomizationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [complexity, setComplexity] = useState<'simple' | 'moderate' | 'complex'>('moderate');
  const [alcoholLevel, setAlcoholLevel] = useState<'low' | 'medium' | 'strong'>('medium');
  const [sweetness, setSweetness] = useState<'dry' | 'balanced' | 'sweet'>('balanced');
  const [dietary, setDietary] = useState<string[]>([]);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const dietaryOptions = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'low-sugar', label: 'Low Sugar' },
    { id: 'alcohol-free', label: 'Alcohol-Free (Mocktail)' },
    { id: 'gluten-free', label: 'Gluten-Free' },
  ];

  const handleApply = () => {
    onApply({
      complexity,
      dietary,
      alcoholLevel,
      sweetness,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setComplexity('moderate');
    setAlcoholLevel('medium');
    setSweetness('balanced');
    setDietary([]);
  };

  const toggleDietary = (option: string) => {
    setDietary(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleButtonClick = () => {
    if (!isPro) {
      setShowUpgradeDialog(true);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={handleButtonClick}
      >
        <Settings2 className="h-4 w-4" />
        Customize
        {!isPro && (
          <Badge variant="secondary" className="ml-1 gap-1 px-1.5">
            <Crown className="h-3 w-3" />
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Advanced Customization
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Pro
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Fine-tune your recipe generation with advanced options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Complexity */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Recipe Complexity</Label>
            <RadioGroup value={complexity} onValueChange={(v) => setComplexity(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="simple" id="simple" />
                <Label htmlFor="simple" className="cursor-pointer font-normal">
                  Simple - Easy to make with common ingredients
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate" className="cursor-pointer font-normal">
                  Moderate - Balanced complexity with some technique
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="complex" id="complex" />
                <Label htmlFor="complex" className="cursor-pointer font-normal">
                  Complex - Advanced techniques and rare ingredients
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Alcohol Level */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Alcohol Level</Label>
            <RadioGroup value={alcoholLevel} onValueChange={(v) => setAlcoholLevel(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer font-normal">
                  Low - Light and refreshing
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer font-normal">
                  Medium - Standard cocktail strength
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="strong" id="strong" />
                <Label htmlFor="strong" className="cursor-pointer font-normal">
                  Strong - Spirit-forward and bold
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sweetness */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Sweetness Level</Label>
            <RadioGroup value={sweetness} onValueChange={(v) => setSweetness(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dry" id="dry" />
                <Label htmlFor="dry" className="cursor-pointer font-normal">
                  Dry - Minimal sweetness
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced" className="cursor-pointer font-normal">
                  Balanced - Perfect mix of sweet and tart
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sweet" id="sweet" />
                <Label htmlFor="sweet" className="cursor-pointer font-normal">
                  Sweet - Rich and dessert-like
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Dietary Preferences</Label>
            <div className="space-y-2">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietary.includes(option.id)}
                    onCheckedChange={() => toggleDietary(option.id)}
                  />
                  <Label
                    htmlFor={option.id}
                    className="cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset to Default
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1"
          >
            Apply Customization
          </Button>
        </div>
      </DialogContent>
    </Dialog>

      <FeatureUpgradeDialog
        isOpen={showUpgradeDialog}
        onClose={() => setShowUpgradeDialog(false)}
        featureName="Advanced Customization"
        featureDescription="Fine-tune your recipes with advanced options: complexity levels, alcohol strength, sweetness preferences, and dietary restrictions."
        featureIcon={<Settings2 className="h-8 w-8 text-white" />}
      />
    </>
  );
}

