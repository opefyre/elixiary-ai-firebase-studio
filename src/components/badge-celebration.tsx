'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/types/badges';
import { getBadgeById } from '@/types/badges';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Crown, Star, Zap, Trophy, Award } from 'lucide-react';

interface BadgeCelebrationProps {
  newBadgeIds: string[];
  onClose: () => void;
}

export function BadgeCelebration({ newBadgeIds, onClose }: BadgeCelebrationProps) {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const currentBadge = getBadgeById(newBadgeIds[currentBadgeIndex]);

  useEffect(() => {
    if (newBadgeIds.length === 0) {
      onClose();
      return;
    }

    // Auto-advance to next badge after 3 seconds
    const timer = setTimeout(() => {
      if (currentBadgeIndex < newBadgeIds.length - 1) {
        setCurrentBadgeIndex(prev => prev + 1);
      } else {
        // All badges shown, close after a delay
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, 2000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentBadgeIndex, newBadgeIds.length, onClose]);

  const getTierIcon = (tier: Badge['tier']) => {
    switch (tier) {
      case 'bronze': return <Award className="h-6 w-6" />;
      case 'silver': return <Star className="h-6 w-6" />;
      case 'gold': return <Crown className="h-6 w-6" />;
      case 'platinum': return <Trophy className="h-6 w-6" />;
      case 'diamond': return <Zap className="h-6 w-6" />;
    }
  };

  const getTierColor = (tier: Badge['tier']) => {
    switch (tier) {
      case 'bronze': return 'from-amber-400 to-amber-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-slate-400 to-slate-600';
      case 'diamond': return 'from-cyan-400 to-cyan-600';
    }
  };

  if (!isVisible || !currentBadge) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <CardContent className="p-6 text-center">
          {/* Celebration Animation */}
          <div className="relative mb-6">
            <div className="text-6xl mb-4 animate-bounce">
              {currentBadge.icon}
            </div>
            <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${getTierColor(currentBadge.tier)} text-white rounded-full p-2`}>
              {getTierIcon(currentBadge.tier)}
            </div>
          </div>

          {/* Badge Info */}
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-primary">
              🎉 Badge Earned!
            </h2>
            <h3 className="text-xl font-semibold">
              {currentBadge.name}
            </h3>
            <p className="text-muted-foreground">
              {currentBadge.description}
            </p>
          </div>

          {/* Progress Indicator */}
          {newBadgeIds.length > 1 && (
            <div className="flex justify-center gap-1 mb-4">
              {newBadgeIds.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentBadgeIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-center">
            {currentBadgeIndex < newBadgeIds.length - 1 ? (
              <Button onClick={() => setCurrentBadgeIndex(prev => prev + 1)}>
                Next Badge
              </Button>
            ) : (
              <Button onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}>
                Awesome!
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
