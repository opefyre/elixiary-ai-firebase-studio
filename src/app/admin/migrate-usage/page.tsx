'use client';

import { useState } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MigrateUsagePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleMigration = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to run migration',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/migrate-usage-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        toast({
          title: 'Migration Successful!',
          description: `Created ${data.documentsCreated} daily usage documents`,
        });
      } else {
        throw new Error(data.error || 'Migration failed');
      }
    } catch (error: any) {
      toast({
        title: 'Migration Failed',
        description: error.message || 'Failed to migrate usage data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8 pt-24">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Please log in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pt-24">
      <Card>
        <CardHeader>
          <CardTitle>Migrate Usage Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This will analyze your existing recipes and create daily usage data for the charts.
            This is a one-time migration to populate historical data.
          </p>
          
          <Button 
            onClick={handleMigration} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Migrating...
              </>
            ) : (
              'Run Migration'
            )}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Migration Completed Successfully!
                </span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p>• Documents created: {result.documentsCreated}</p>
                <p>• Total generated: {result.totalGenerated}</p>
                <p>• Total saved: {result.totalSaved}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
