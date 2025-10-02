import { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Shield, AlertTriangle, Lock, Calculator, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { RiskSettingsInterface } from '@/lib/types';
import apiClient from '@/services/Api';

export const RiskConfigModal = ({
  open,
  onConfigModalClose,
  setting,
  strategy,
}: {
  open: boolean;
  onConfigModalClose: () => void;
  setting: any;
  strategy: any;
}) => {
  const { setUser } = useAuth();

  const [riskSettings, setRiskSettings] = useState<RiskSettingsInterface | null>(null);
  const [quickTemplate, setQuickTemplate] = useState<'Conservative' | 'Balanced' | 'Aggressive' | ''>(''); // Conservative, Balanced, Aggressive

  function onTemplateClick(template: 'Conservative' | 'Balanced' | 'Aggressive' | '') {
    setQuickTemplate(template);
    if (template === 'Conservative') {
      setRiskSettings({
        ...riskSettings,
        riskPerTrade: 0.5,
        maxCurrentPositions: 2,
        dailyLossLimit: 2,
        dailyLossCurrency: 'percentage',
        maxLossLimit: 5,
        maxLossCurrency: 'percentage',
      });
    } else if (template === 'Balanced') {
      setRiskSettings({
        ...riskSettings,
        riskPerTrade: 1,
        maxCurrentPositions: 3,
        dailyLossLimit: 3,
        dailyLossCurrency: 'percentage',
        maxLossLimit: 10,
        maxLossCurrency: 'percentage',
      });
    } else if (template === 'Aggressive') {
      setRiskSettings({
        ...riskSettings,
        riskPerTrade: 2,
        maxCurrentPositions: 4,
        dailyLossLimit: 6,
        dailyLossCurrency: 'percentage',
        maxLossLimit: 15,
        maxLossCurrency: 'percentage',
      });
    }
  }

  useEffect(() => {
    if (setting) {
      setRiskSettings(setting);
    }
  }, [setting]);

  function onRiskSettingsChange(key: string, value: string | boolean | number) {
    setRiskSettings({
      ...riskSettings,
      [key]: value,
    });
  }

  async function onSaveClick() {
    try {
      const data = await apiClient.post('/users/strategy/update-setting', {
        title: strategy?.title,
        ...riskSettings,
      });
      console.log('Data:', data);
      setUser(data.user);
      onConfigModalClose();
    } catch (error) {
      console.error('Error while saving:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onConfigModalClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            Risk Management for {strategy?.title}
          </DialogTitle>
        </DialogHeader>

        <div>
          {/* Risk Templates */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <div className="p-6 py-2">
              <h2 className="text-xl font-semibold mb-4">Quick Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  className={`h-auto px-4 py-2 justify-start hover:border-profit/50 ${
                    quickTemplate === 'Conservative' ? 'border-profit/50' : ''
                  }`}
                  onClick={() => onTemplateClick('Conservative')}
                >
                  <div className="text-left">
                    <p className="font-semibold mb-1">Conservative</p>
                    <p className="text-xs text-muted-foreground">1% risk, strict limits</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto px-4 py-2 justify-start hover:border-primary/50 ${
                    quickTemplate === 'Balanced' ? 'border-primary/50' : ''
                  }`}
                  onClick={() => onTemplateClick('Balanced')}
                >
                  <div className="text-left">
                    <p className="font-semibold mb-1">Balanced</p>
                    <p className="text-xs text-muted-foreground">2% risk, moderate limits</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto px-4 py-2 justify-start hover:border-loss/50 ${
                    quickTemplate === 'Aggressive' ? 'border-loss/50' : ''
                  }`}
                  onClick={() => onTemplateClick('Aggressive')}
                >
                  <div className="text-left">
                    <p className="font-semibold mb-1">Aggressive</p>
                    <p className="text-xs text-muted-foreground">3% risk, flexible limits</p>
                  </div>
                </Button>
              </div>
            </div>
          </Card>

          {/* Custom Settings */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Custom Settings</h2>
              <div className="space-y-4">
                {/* Risk Per Trade */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Risk Per Trade</Label>
                    <span className="text-sm font-medium text-primary">{riskSettings?.riskPerTrade}%</span>
                  </div>
                  <Slider
                    value={[riskSettings?.riskPerTrade]}
                    max={5}
                    step={0.5}
                    className="mb-2"
                    onValueChange={(value) => {
                      onRiskSettingsChange('riskPerTrade', value[0].toString());
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>2.5%</span>
                    <span>5%</span>
                  </div>
                </div>

                {/* Max Positions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Max Concurrent Positions</Label>
                    <span className="text-sm font-medium text-primary">{riskSettings?.maxCurrentPositions}</span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    className="mb-2"
                    value={[riskSettings?.maxCurrentPositions]}
                    onValueChange={(value) => {
                      onRiskSettingsChange('maxCurrentPositions', value[0].toString());
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Daily Loss Limit */}
                <div>
                  <Label>Daily Loss Limit</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="1000"
                      className="flex-1"
                      value={riskSettings?.dailyLossLimit ?? ''}
                      onChange={(e) => onRiskSettingsChange('dailyLossLimit', e.target.value)}
                    />
                    <Select
                      value={riskSettings?.dailyLossCurrency ?? 'percentage'}
                      onValueChange={(value) => onRiskSettingsChange('dailyLossCurrency', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">USD</SelectItem>
                        <SelectItem value="percentage">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Maximum Loss Limit */}
                <div>
                  <Label>Maximum Loss Limit</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="1000"
                      className="flex-1"
                      value={riskSettings?.maxLossLimit ?? ''}
                      onChange={(e) => onRiskSettingsChange('maxLossLimit', e.target.value)}
                    />
                    <Select
                      value={riskSettings?.maxLossCurrency ?? 'percentage'}
                      onValueChange={(value) => onRiskSettingsChange('maxLossCurrency', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">USD</SelectItem>
                        <SelectItem value="percentage">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Actions on Limit Breach */}
                <div className="space-y-3">
                  <Label>Actions on Limit Breach</Label>
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm">Close all positions</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isCloseAllPositions}
                        onCheckedChange={(value) => onRiskSettingsChange('isCloseAllPositions', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-loss" />
                        <span className="text-sm">Pause trading for the day</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isPauseTrading}
                        onCheckedChange={(value) => onRiskSettingsChange('isPauseTrading', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="text-sm">Send alert notification</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isSendNotification}
                        onCheckedChange={(value) => onRiskSettingsChange('isSendNotification', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="gold" onClick={() => onSaveClick()}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
