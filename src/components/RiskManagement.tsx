import { useState } from "react";
import axios from 'axios';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  DollarSign,
  Percent,
  TrendingDown,
  Lock,
  Calculator,
  Settings,
  TrendingUp
} from "lucide-react";

const RiskManagement = () => {
  const [quickTemplate, setQuickTemplate] = useState<string>("") // Conservative, Balanced, Aggressive

  const [riskType, setRiskType] = useState<string>("percentage")
  const [riskPerTrade, setRiskPerTrade] = useState<number>(2)
  const [accountBalance, setAccountBalance] = useState<number>(25000)
  const [stopLossType, setStopLossType] = useState<string>("atr")
  const [atrMultiplier, setAtrMultiplier] = useState<number>(1.5)

  const [maxCurrentPositions, setMaxCurrentPositions] = useState<number>(1)
  const [dailyLossLimit, setDailyLossLimit] = useState<number>(1000)
  const [maximumDrawdown, setMaximumDrawdown] = useState<number>(2500)
  const [isCloseAllPositions, setIsCloseAllPositions] = useState<boolean>(true)
  const [isPauseTrading, setIsPauseTrading] = useState<boolean>(true)
  const [isSendNotification, setIsSendNotification] = useState<boolean>(true)
  
  const [isAutoStopLoss, setIsAutoStopLoss] = useState<boolean>(true)
  const [isTrailingStop, setIsTrailingStop] = useState<boolean>(true)
  const [trailingDistance, setTrailingDistance] = useState<number>(20)
  const [isMoveToBreak, setIsMoveToBreak] = useState<boolean>(true)
  const [triggerAtProfit, setTriggerAtProfit] = useState<number>(15)
  
  const [isAutoTakeProfit, setIsAutoTakeProfit] = useState<boolean>(true)
  const [partialClose, setPartialClose] = useState([
    { close: 0, target: 0},
    { close: 0, target: 0},
    { close: 0, target: 0},
    { close: 0, target: 0}
  ])

  function onTemplateClick(template: string) {
    setQuickTemplate(template)
    if (template === "Conservative")
      setRiskPerTrade(1)
    else if (template === "Balanced")
      setRiskPerTrade(2)
    else if (template === "Aggressive")
      setRiskPerTrade(3)
  }

  function automaticStopLossChanged(value: boolean) {
    setIsAutoStopLoss(value)
    if (value == false) {
      setIsTrailingStop(false)
      setIsMoveToBreak(false)
    }
  }

  function onPartialCloseChange(key: string, value: string, index: number) {
    setPartialClose(prev => {
      const newArray = [...prev]
      const updatedItem = { ...newArray[index] }
      updatedItem[key] = Number(value)
      newArray[index] = updatedItem
      return newArray
    });
  }

  async function onSaveClick() {
    const riskAmount = 0
    const positionSize = 0
    const settings = {
      positionSize: {
        riskType,
        riskPerTrade,
        accountBalance,
        stopLossType,
        atrMultiplier,
        riskAmount,
        positionSize
      },
      tradingLimits: {
        maxCurrentPositions,
        dailyLossLimit,
        maximumDrawdown,
        isCloseAllPositions,
        isPauseTrading,
        isSendNotification
      },
      stopLossSettings: {
        isAutoStopLoss,
        isTrailingStop,
        trailingDistance,
        isMoveToBreak,
        triggerAtProfit
      },
      takeProfitSettings: {
        isAutoTakeProfit,
        partialClose
      },
    }

    const response = await axios.post("http://localhost:3000/api/v1/users/risk-management", settings)
    console.log("Response:", response)
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
              className={`h-auto p-4 justify-start hover:border-profit/50 ${quickTemplate === "Conservative" ? "border-profit/50" : ""}`}
              onClick={() => onTemplateClick("Conservative")}
            >
              <div className="text-left">
                <p className="font-semibold mb-1">Conservative</p>
                <p className="text-xs text-muted-foreground">1% risk, strict limits</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className={`h-auto p-4 justify-start hover:border-primary/50 ${quickTemplate === "Balanced" ? "border-primary/50" : ""}`}
              onClick={() => onTemplateClick("Balanced")}
            >
              <div className="text-left">
                <p className="font-semibold mb-1">Balanced</p>
                <p className="text-xs text-muted-foreground">2% risk, moderate limits</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className={`h-auto p-4 justify-start hover:border-loss/50 ${quickTemplate === "Aggressive" ? "border-loss/50" : ""}`}
              onClick={() => onTemplateClick("Aggressive")}
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

                {/* Risk Type Selection */}
                <div className="space-y-4">
                  <div>
                    <Label>Risk Type</Label>
                    <Select value={riskType} onValueChange={(value) => setRiskType(value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage Risk</SelectItem>
                        <SelectItem value="fixed">Fixed Lot Size</SelectItem>
                        <SelectItem value="contracts">Fixed Contracts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Risk Per Trade */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Risk Per Trade</Label>
                      <span className="text-sm font-medium text-primary">{riskPerTrade}%</span>
                    </div>
                    <Slider 
                      value={[riskPerTrade]}
                      max={5} 
                      step={0.5}
                      className="mb-2"
                      onValueChange={(value) => {setRiskPerTrade(value[0])}}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>2.5%</span>
                      <span>5%</span>
                    </div>
                  </div>

                  {/* Account Balance */}
                  <div>
                    <Label>Account Balance</Label>
                    <Input 
                      type="number" 
                      placeholder="25000" 
                      className="mt-2"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Stop Loss Type */}
                <div>
                  <Label>Stop Loss Type</Label>
                  <Select value={stopLossType}  onValueChange = {(value) => {setStopLossType(value)}}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atr">ATR-Based</SelectItem>
                      <SelectItem value="percentage">Percentage-Based</SelectItem>
                      <SelectItem value="fixed">Fixed Pips/Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ATR Multiplier */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>ATR Multiplier</Label>
                    <span className="text-sm font-medium text-primary">{atrMultiplier}x</span>
                  </div>
                  <Slider 
                    min={0.5}
                    max={3} 
                    step={0.1}
                    className="mb-2"
                    value={[atrMultiplier]}
                    onValueChange={(value) => setAtrMultiplier(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5</span>
                    <span>3</span>
                  </div>
                </div>

                {/* Calculation Result */}
                <div className="bg-background/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Example Calculation</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Risk Amount</p>
                      <p className="text-lg font-semibold text-profit">$500</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Position Size</p>
                      <p className="text-lg font-semibold">0.5 Lots</p>
                    </div>
                  </div>
                </div>
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
                    <span className="text-sm font-medium text-primary">{maxCurrentPositions}</span>
                  </div>
                  <Slider 
                    min={1}
                    max={10} 
                    step={1}
                    className="mb-2"
                    value={[maxCurrentPositions]} 
                    onValueChange={(value) => {setMaxCurrentPositions(value[0])}}
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
                      type="number" 
                      placeholder="1000" 
                      className="flex-1"
                      value={dailyLossLimit}
                      onChange={(e) => setDailyLossLimit(Number(e.target.value))}
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
                <div>
                  <Label>Maximum Drawdown</Label>
                  <div className="flex gap-2 mt-2">
                    <Input 
                      type="number" 
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
                      <Switch checked={isCloseAllPositions} onCheckedChange={(value) => setIsCloseAllPositions(value)} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-loss" />
                        <span className="text-sm">Pause trading for the day</span>
                      </div>
                      <Switch checked={isPauseTrading} onCheckedChange={(value) => setIsPauseTrading(value)} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-primary" />
                        <span className="text-sm">Send alert notification</span>
                      </div>
                      <Switch checked={isSendNotification} onCheckedChange={(value) => setIsSendNotification(value)} />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Stop Loss Settings */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="h-5 w-5 text-loss" />
                  <h3 className="text-lg font-semibold">Stop Loss Configuration</h3>
                </div>

                {/* Automatic Stop Loss */}
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">Automatic Stop Loss</p>
                    <p className="text-sm text-muted-foreground">Place stop loss with every order</p>
                  </div>
                  <Switch checked={isAutoStopLoss} onCheckedChange={(value) => automaticStopLossChanged(value)} />
                </div>

                {/* Trailing Stop */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Enable Trailing Stop</Label>
                    <Switch checked={isTrailingStop} onCheckedChange={(value) => setIsTrailingStop(value && isAutoStopLoss)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Trailing Distance (pips)</Label>
                    <Input 
                      type="number" 
                      placeholder="20" 
                      value={trailingDistance} 
                      onChange={(e) => setTrailingDistance(Number(e.target.value))} 
                      disabled={!isAutoStopLoss || !isTrailingStop} 
                    />
                  </div>
                </div>

                {/* Break Even */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Move to Break Even</Label>
                    <Switch checked={isMoveToBreak} onCheckedChange={(value) => setIsMoveToBreak(value && isAutoStopLoss)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Trigger at Profit (pips)</Label>
                    <Input 
                      type="number" 
                      placeholder="15" 
                      value={triggerAtProfit} 
                      onChange={(e) => setTriggerAtProfit(Number(e.target.value))} 
                      disabled={!isAutoStopLoss || !isMoveToBreak} 
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Take Profit Settings */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-profit" />
                  <h3 className="text-lg font-semibold">Take Profit Configuration</h3>
                </div>

                {/* Automatic Stop Loss */}
                <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">Automatic Take Profit</p>
                    <p className="text-sm text-muted-foreground">Place take profit with every order</p>
                  </div>
                  <Switch checked={isAutoTakeProfit} onCheckedChange={(value) => setIsAutoTakeProfit(value)} />
                </div>

                {/* Partial Close */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Partial Close</Label>
                    {/* <Switch /> */}
                  </div>

                  {/* Target 1 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Close %</Label>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        className="mt-1" 
                        max="100" 
                        min={0} 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[0].close}
                        onChange={(e) => onPartialCloseChange("close", e.target.value, 0)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">At Target 1</Label>
                      <Input 
                        type="number" 
                        placeholder="1.5" 
                        className="mt-1" 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[0].target}
                        onChange={(e) => onPartialCloseChange("target", e.target.value, 0)}
                      />
                    </div>
                  </div>

                  {/* Target 2 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Close %</Label>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        className="mt-1" 
                        max="100" 
                        min={0} 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[1].close}
                        onChange={(e) => onPartialCloseChange("close", e.target.value, 1)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">At Target 2</Label>
                      <Input 
                        type="number" 
                        placeholder="1.5" 
                        className="mt-1" 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[1].target}
                        onChange={(e) => onPartialCloseChange("target", e.target.value, 1)}
                      />
                    </div>
                  </div>
                  
                  {/* Target 3 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Close %</Label>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        className="mt-1" 
                        max="100" 
                        min={0} 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[2].close}
                        onChange={(e) => onPartialCloseChange("close", e.target.value, 2)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">At Target 3</Label>
                      <Input 
                        type="number" 
                        placeholder="1.5" 
                        className="mt-1" 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[2].target}
                        onChange={(e) => onPartialCloseChange("target", e.target.value, 2)}
                      />
                    </div>
                  </div>

                  {/* Target 4 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Close %</Label>
                      <Input 
                        type="number" 
                        placeholder="25" 
                        className="mt-1" 
                        max="100" 
                        min={0} 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[3].close}
                        onChange={(e) => onPartialCloseChange("close", e.target.value, 3)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm">At Target 4</Label>
                      <Input 
                        type="number" 
                        placeholder="1.5" 
                        className="mt-1" 
                        disabled={!isAutoTakeProfit} 
                        value={partialClose[3].target}
                        onChange={(e) => onPartialCloseChange("target", e.target.value, 3)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskManagement;