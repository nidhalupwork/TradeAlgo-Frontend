import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Key, Plus, RotateCw } from 'lucide-react';
import { useState } from 'react';

const apiKeys = [
  {
    id: 1,
    name: 'TradingView Webhook',
    key: 'tvw_1234567890abcdef',
    created: '2024-01-15',
    lastUsed: '2 hours ago',
    status: 'active',
  },
  {
    id: 2,
    name: 'Mobile App API',
    key: 'mob_abcdef1234567890',
    created: '2024-01-10',
    lastUsed: '5 days ago',
    status: 'active',
  },
];

export const APISettings = () => {
  const [showKeys, setShowKeys] = useState<{ [key: number]: boolean }>({});

  const toggleKeyVisibility = (id: number) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '••••••••••••••••';
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys & Webhooks
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your API keys for TradingView and third-party integrations
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Generate Key
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="p-4 rounded-lg border bg-gradient-subtle space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{apiKey.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created: {apiKey.created} • Last used: {apiKey.lastUsed}
                  </p>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">{apiKey.status}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                    readOnly
                    className="pr-20 font-mono text-sm"
                  />
                  <div className="absolute right-1 top-1 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => navigator.clipboard.writeText(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <RotateCw className="h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-3">Webhook URLs</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="webhook-url">TradingView Webhook URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="webhook-url"
                  value="https://api.yourplatform.com/webhook/tv/signals"
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText('https://api.yourplatform.com/webhook/tv/signals')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Use this URL in your TradingView alerts to send trading signals
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
