'use client';

import { Badge, BadgeProgress } from '@/types/badges';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Zap, Trophy, Award } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  progress?: number;
  current?: number;
  required?: number;
}

export function BadgeCard({ badge, isUnlocked, progress = 0, current = 0, required = 1 }: BadgeCardProps) {
  const getTierIcon = (tier: Badge['tier']) => {
    switch (tier) {
      case 'bronze': return <Award className="h-3 w-3" />;
      case 'silver': return <Star className="h-3 w-3" />;
      case 'gold': return <Crown className="h-3 w-3" />;
      case 'platinum': return <Trophy className="h-3 w-3" />;
      case 'diamond': return <Zap className="h-3 w-3" />;
    }
  };

  const getTierColor = (tier: Badge['tier']) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'platinum': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'diamond': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    }
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
        isUnlocked 
          ? 'ring-2 ring-primary/20 bg-gradient-to-br from-background to-primary/5' 
          : 'opacity-60'
      }`}
      title={`${badge.name}: ${badge.description}${!isUnlocked ? ` (${current}/${required})` : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`text-2xl ${isUnlocked ? '' : 'grayscale'}`}>
            {badge.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-semibold text-sm ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {badge.name}
              </h4>
              <UIBadge 
                variant="outline" 
                className={`text-xs ${getTierColor(badge.tier)}`}
              >
                {getTierIcon(badge.tier)}
                <span className="ml-1 capitalize">{badge.tier}</span>
              </UIBadge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {badge.description}
            </p>
            {!isUnlocked && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{current} / {required}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BadgeGridProps {
  badges: BadgeProgress[];
  category?: 'generation' | 'collection' | 'achievement';
  showProgress?: boolean;
}

export function BadgeGrid({ badges, category, showProgress = true }: BadgeGridProps) {
  const filteredBadges = category 
    ? badges.filter(b => b.badge.category === category)
    : badges;

  const unlockedBadges = filteredBadges.filter(b => b.isUnlocked);
  const lockedBadges = filteredBadges.filter(b => !b.isUnlocked);

  return (
    <div className="space-y-4">
      {unlockedBadges.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-3 text-green-600">
            ✅ Unlocked ({unlockedBadges.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unlockedBadges.map((badgeProgress) => (
              <BadgeCard
                key={badgeProgress.badge.id}
                badge={badgeProgress.badge}
                isUnlocked={true}
              />
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && showProgress && (
        <div>
          <h4 className="font-semibold text-sm mb-3 text-muted-foreground">
            🔒 In Progress ({lockedBadges.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lockedBadges.map((badgeProgress) => (
              <BadgeCard
                key={badgeProgress.badge.id}
                badge={badgeProgress.badge}
                isUnlocked={false}
                progress={badgeProgress.progress}
                current={badgeProgress.current}
                required={badgeProgress.required}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BadgeStatsProps {
  stats: {
    totalBadges: number;
    unlockedBadges: number;
    completionPercentage: number;
    byTier: {
      bronze: number;
      silver: number;
      gold: number;
      platinum: number;
      diamond: number;
    };
    byCategory: {
      generation: number;
      collection: number;
      achievement: number;
    };
  };
}

export function BadgeStats({ stats }: BadgeStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.unlockedBadges}</div>
          <div className="text-xs text-muted-foreground">Badges Earned</div>
          <div className="text-xs text-muted-foreground">of {stats.totalBadges}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.completionPercentage}%</div>
          <div className="text-xs text-muted-foreground">Complete</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.byTier.gold + stats.byTier.platinum + stats.byTier.diamond}</div>
          <div className="text-xs text-muted-foreground">Rare Badges</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.byCategory.achievement}</div>
          <div className="text-xs text-muted-foreground">Special</div>
        </CardContent>
      </Card>
    </div>
  );
}
