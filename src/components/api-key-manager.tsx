'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Key, Plus, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';

interface APIKey {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'revoked';
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  usage: {
    requestsToday: number;
    requestsThisMonth: number;
    totalRequests: number;
  };
}

export function APIKeyManager() {
  const { auth, user, isUserLoading } = useFirebase();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [deleteKeyId, setDeleteKeyId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      fetchAPIKeys();
    } else if (!isUserLoading && !user) {
      setLoading(false);
    }
  }, [user, isUserLoading]);

  const fetchAPIKeys = async () => {
    try {
        if (!user || !auth) {
          toast({
            title: 'Error',
            description: 'Please sign in to manage API keys',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        
        const response = await fetch('/api/account/api-keys', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
      
      if (data.success) {
        setApiKeys(data.data);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch API keys',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch API keys',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createAPIKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the API key',
        variant: 'destructive'
      });
      return;
    }

    if (!user || !auth) {
      toast({
        title: 'Error',
        description: 'Please sign in to create API keys',
        variant: 'destructive'
      });
      return;
    }

    setCreating(true);
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/account/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newKeyName.trim() })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNewKey(data.data.id);
        setNewKeyName('');
        setShowNewKeyDialog(false);
        fetchAPIKeys();
        toast({
          title: 'Success',
          description: 'API key created successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create API key',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create API key',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteClick = (keyId: string) => {
    setDeleteKeyId(keyId);
    setShowDeleteDialog(true);
  };

  const revokeAPIKey = async () => {
    if (!deleteKeyId || !user || !auth) {
      return;
    }

    try {
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/account/api-keys/${deleteKeyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchAPIKeys();
        toast({
          title: 'Success',
          description: 'API key deleted successfully'
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete API key',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete API key',
        variant: 'destructive'
      });
    } finally {
      setShowDeleteDialog(false);
      setDeleteKeyId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isUserLoading || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access to the Elixiary AI API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access to the Elixiary AI API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Please sign in to manage API keys</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your API keys for programmatic access to the Elixiary AI API
              </CardDescription>
            </div>
            <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key to access the Elixiary AI API programmatically.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., My App Integration"
                      maxLength={50}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewKeyDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={createAPIKey}
                      disabled={creating || !newKeyName.trim()}
                    >
                      {creating ? 'Creating...' : 'Create Key'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {apiKeys.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Key className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="font-medium text-lg mb-2">No API keys created yet</h3>
              <p className="text-sm">Create your first API key to start using the API</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div key={key.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <h3 className="font-medium text-base">{key.name}</h3>
                      <Badge variant={key.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {key.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteClick(key.id)}
                        className="h-8 px-3 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground">Created</p>
                      <p>{formatDate(key.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Last Used</p>
                      <p>{formatDate(key.lastUsed)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Today's Requests</p>
                      <p>{key.usage.requestsToday}</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Total Requests</p>
                      <p>{key.usage.totalRequests}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Key Dialog */}
      {newKey && (
        <Dialog open={!!newKey} onOpenChange={() => setNewKey(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New API Key Created</DialogTitle>
              <DialogDescription>
                Your new API key has been generated. Copy it now as you won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your new API key has been created. Copy it now as it won't be shown again.
              </p>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center gap-2">
                  <Textarea
                    value={newKey}
                    readOnly
                    className="font-mono text-sm"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Store this API key securely. It won't be shown again.
                </p>
              </div>
              <Button onClick={() => setNewKey(null)} className="w-full">
                I've Saved My API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete API Key
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone and any applications using this key will stop working immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this API key? This action cannot be undone and any applications using this key will stop working immediately.
            </p>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive font-medium">
                ⚠️ This action is permanent and cannot be reversed.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={revokeAPIKey}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
