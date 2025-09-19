import { useEffect, useState } from 'react';

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

const RiskManagement = () => {
  const { user, setUser } = useAuth();

  const [riskSettings, setRiskSettings] = useState<RiskSettingsInterface | null>(null);
  const [quickTemplate, setQuickTemplate] = useState<string>(''); // Conservative, Balanced, Aggressive
  // const [positionSize, setPositionSize] = useState<PositionSizeInterface>({
  //   positionSize: 0.5,
  //   riskAmount: 500,
  // });

  function onTemplateClick(template: string) {
    setQuickTemplate(template);
    if (template === 'Conservative') onRiskSettingsChange('positionSize', 'riskPerTrade', 1);
    else if (template === 'Balanced') onRiskSettingsChange('positionSize', 'riskPerTrade', 2);
    else if (template === 'Aggressive') onRiskSettingsChange('positionSize', 'riskPerTrade', 3);
  }

  useEffect(() => {
    setRiskSettings(user?.riskSettings);
  }, [user]);


  function onRiskSettingsChange(parentKey: string, key: string, value: string | boolean | number) {
    const temp = riskSettings[parentKey];
    setRiskSettings({
      ...riskSettings,
      [parentKey]: {
        ...temp,
        [key]: value,
      },
    });
  }

  async function onSaveClick() {
    try {
      const data = await apiClient.post('/users/risk-management', riskSettings);
      console.log('Data:', data);
      setUser(data.user);
    } catch (error) {
      console.error('Error while saving:', error);
    }
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Risk Management</h1>
          <p className="text-muted-foreground">Configure your trading risk parameters and position sizing</p>
        </div>
        <Button variant="gold" onClick={() => onSaveClick()}>
          <Lock className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Risk Templates */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={`h-auto p-4 justify-start hover:border-profit/50 ${
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
              className={`h-auto p-4 justify-start hover:border-primary/50 ${
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
              className={`h-auto p-4 justify-start hover:border-loss/50 ${
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
          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {/* Position Sizing */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Position Size Calculator</h3>
                </div>

                <div className="space-y-4">
                  {/* Risk Type Selection */}
                  {/* <div>
                    <Label>Risk Type</Label>
                    <Select
                      value={riskSettings?.positionSize?.riskType || 'percentage'}
                      onValueChange={(value) => onRiskSettingsChange('positionSize', 'riskType', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Risk</SelectItem>
                        <SelectItem value="fixed">Fixed Lot Size</SelectItem>
                        <SelectItem value="contracts">Fixed Contracts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* Risk Per Trade */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Risk Per Trade</Label>
                      <span className="text-sm font-medium text-primary">
                        {riskSettings?.riskPerTrade}%
                      </span>
                    </div>
                    <Slider
                      value={[riskSettings?.riskPerTrade]}
                      max={5}
                      step={0.5}
                      className="mb-2"
                      onValueChange={(value) => {
                        onRiskSettingsChange('positionSize', 'riskPerTrade', value[0].toString());
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>2.5%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  {/* Account Balance */}
                  {/* <div>
                    <Label>Account Balance</Label>
                    <Input
                      placeholder="25000"
                      className="mt-2"
                      value={riskSettings?.accountBalance || ''}
                      onChange={(e) => onRiskSettingsChange('positionSize', 'accountBalance', e.target.value)}
                    />
                  </div> */}
                </div>

                {/* Stop Loss Type */}
                {/* <div>
                  <Label>Stop Loss Type</Label>
                  <Select
                    value={riskSettings?.positionSize?.stopLossType}
                    onValueChange={(value) => onRiskSettingsChange('positionSize', 'stopLossType', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atr">ATR-Based</SelectItem>
                      <SelectItem value="percentage">Percentage-Based</SelectItem>
                      <SelectItem value="fixed">Fixed Pips/Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* ATR Multiplier */}
                {/* {riskSettings?.positionSize?.stopLossType === 'atr' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>ATR Multiplier</Label>
                      <span className="text-sm font-medium text-primary">
                        {riskSettings?.positionSize?.atrMultiplier}x
                      </span>
                    </div>
                    <Slider
                      min={0.5}
                      max={3}
                      step={0.1}
                      className="mb-2"
                      value={[riskSettings?.positionSize?.atrMultiplier]}
                      onValueChange={(value) => {
                        onRiskSettingsChange('positionSize', 'atrMultiplier', value[0].toString());
                      }}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5</span>
                      <span>3</span>
                    </div>
                  </div>
                )} */}

                {/* Stop Loss Percentage */}
                {/* {riskSettings?.positionSize?.stopLossType === 'percentage' && (
                  <div>
                    <Label>Stop Loss Percentage</Label>
                    <Input
                      placeholder="1000"
                      className="flex-1"
                      value={riskSettings?.positionSize?.stopLossPercentage}
                      onChange={(e) => onRiskSettingsChange('positionSize', 'stopLossPercentage', e.target.value)}
                    />
                  </div>
                )} */}

                {/* Calculation Result */}
                {/* <div className="bg-background/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Example Calculation</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Amount</p>
                      <p className="text-lg font-semibold text-profit">${positionSize.riskAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Position Size</p>
                      <p className="text-lg font-semibold">{positionSize.positionSize} Lots</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </Card>

            {/* Trading Limits */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Trading Limits</h3>
                </div>

                {/* Max Positions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Max Concurrent Positions</Label>
                    <span className="text-sm font-medium text-primary">
                      {riskSettings?.maxCurrentPositions}
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    className="mb-2"
                    value={[riskSettings?.maxCurrentPositions]}
                    onValueChange={(value) => {
                      onRiskSettingsChange('tradingLimits', 'maxCurrentPositions', value[0].toString());
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
                      value={riskSettings?.dailyLossLimit || ''}
                      onChange={(e) => onRiskSettingsChange('tradingLimits', 'dailyLossLimit', e.target.value)}
                    />
                    <Select defaultValue="amount">
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

                {/* Overall Drawdown */}
                {/* <div>
                  <Label>Maximum Drawdown</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      
                      placeholder="2500"
                      className="flex-1"
                      value={maximumDrawdown}
                      onChange={(e) => setMaximumDrawdown(Number(e.target.value))}
                    />
                    <Select defaultValue="amount">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">USD</SelectItem>
                        <SelectItem value="percentage">%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div> */}

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
                        onCheckedChange={(value) => onRiskSettingsChange('tradingLimits', 'isCloseAllPositions', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-loss" />
                        <span className="text-sm">Pause trading for the day</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isPauseTrading}
                        onCheckedChange={(value) => onRiskSettingsChange('tradingLimits', 'isPauseTrading', value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="text-sm">Send alert notification</span>
                      </div>
                      <Switch
                        checked={!!riskSettings?.isSendNotification}
                        onCheckedChange={(value) => onRiskSettingsChange('tradingLimits', 'isSendNotification', value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stop Loss Settings */}
            {/* <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="h-5 w-5 text-loss" />
                  <h3 className="text-lg font-semibold">Stop Loss Configuration</h3>
                </div> */}

            {/* Automatic Stop Loss */}
            {/* <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">Automatic Stop Loss</p>
                    <p className="text-sm text-muted-foreground">Place stop loss with every order</p>
                  </div>
                  <Switch
                    checked={!!riskSettings?.stopLossSettings?.isAutoStopLoss}
                    onCheckedChange={(value) => onRiskSettingsChange('stopLossSettings', 'isAutoStopLoss', value)}
                  />
                </div> */}

            {/* Trailing Stop */}
            {/* <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Enable Trailing Stop</Label>
                    <Switch
                      checked={!!riskSettings?.stopLossSettings?.isTrailingStop}
                      onCheckedChange={(value) => onRiskSettingsChange('stopLossSettings', 'isTrailingStop', value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Trailing Units</Label>
                    <Select
                      value={riskSettings?.stopLossSettings?.trailingUnits}
                      onValueChange={(value) => onRiskSettingsChange('stopLossSettings', 'trailingUnits', value)}
                      disabled={!riskSettings?.stopLossSettings?.isTrailingStop}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Trailing Distance</Label>
                    <Input
                      placeholder="20"
                      value={riskSettings?.stopLossSettings?.trailingDistance}
                      onChange={(e) =>
                        onRiskSettingsChange('stopLossSettings', 'trailingDistance', Number(e.target.value))
                      }
                      disabled={!riskSettings?.stopLossSettings?.isTrailingStop}
                    />
                  </div>
                </div> */}

            {/* Break Even */}
            {/* <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Move to Break Even</Label>
                    <Switch checked={isMoveToBreak} onCheckedChange={(value) => setIsMoveToBreak(value && isAutoStopLoss)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Trigger at Profit (pips)</Label>
                    <Input 
                       
                      placeholder="15" 
                      value={triggerAtProfit} 
                      onChange={(e) => setTriggerAtProfit(Number(e.target.value))} 
                      disabled={!isAutoStopLoss || !isMoveToBreak} 
                    />
                  </div>
                </div> */}
            {/* </div>
            </Card> */}

            {/* Take Profit Settings */}
            {/* <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-profit" />
                  <h3 className="text-lg font-semibold">Take Profit Configuration</h3>
                </div> */}

            {/* Automatic Stop Loss */}
            {/* <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">Automatic Take Profit</p>
                    <p className="text-sm text-muted-foreground">Place take profit with every order</p>
                  </div>
                  <Switch
                    checked={!!riskSettings?.takeProfitSettings?.isAutoTakeProfit}
                    onCheckedChange={(value) => onRiskSettingsChange('takeProfitSettings', 'isAutoTakeProfit', value)}
                  />
                </div> */}

            {/* <div className="space-y-2">
                  <Label className="text-sm">Levels</Label>
                  <Input
                    placeholder="2"
                    value={levels}
                    max={5}
                    onChange={(e) => onLevelsChange(Number(e.target.value))}
                  />
                </div> */}

            {/* Partial Close */}
            {/* <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Partial Close</Label>
                    <Switch />
                  </div>

                  {Array.from({ length: levels }).map((_, index) => {
                    return (
                      <div className="grid grid-cols-2 gap-3" key={index}>
                        <div>
                          <Label className="text-sm">Close (%)</Label>
                          <Input
                            placeholder="25"
                            className="mt-1"
                            max="100"
                            min={0}
                            value={riskSettings?.takeProfitSettings?.partialClose[index].close || 0}
                            onChange={(e) => onPartialCloseChange('close', e.target.value, index)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">At Target {1 + index}</Label>
                          <Input
                            placeholder="1.5"
                            className="mt-1"
                            value={riskSettings?.takeProfitSettings?.partialClose[index].target || 0}
                            onChange={(e) => onPartialCloseChange('target', e.target.value, index)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div> */}
            {/* </div> */}
            {/* </Card> */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskManagement;
