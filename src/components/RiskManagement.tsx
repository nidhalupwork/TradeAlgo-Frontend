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
  Settings
} from "lucide-react";

const RiskManagement = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Risk Management</h1>
          <p className="text-muted-foreground">Configure your trading risk parameters and position sizing</p>
        </div>
        <Button variant="gold">
          <Lock className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Risk Templates */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start hover:border-profit/50">
              <div className="text-left">
                <p className="font-semibold mb-1">Conservative</p>
                <p className="text-xs text-muted-foreground">1% risk, strict limits</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start hover:border-primary/50">
              <div className="text-left">
                <p className="font-semibold mb-1">Balanced</p>
                <p className="text-xs text-muted-foreground">2% risk, moderate limits</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start hover:border-loss/50">
              <div className="text-left">
                <p className="font-semibold mb-1">Aggressive</p>
                <p className="text-xs text-muted-foreground">3% risk, flexible limits</p>
              </div>
            </Button>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="position" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur-sm">
          <TabsTrigger value="position">Position Sizing</TabsTrigger>
          <TabsTrigger value="limits">Risk Limits</TabsTrigger>
          <TabsTrigger value="stops">Stop Loss Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="position" className="space-y-4">
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
                  <Select defaultValue="percentage">
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
                    <span className="text-sm font-medium text-primary">2%</span>
                  </div>
                  <Slider 
                    defaultValue={[2]} 
                    max={5} 
                    step={0.5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.5%</span>
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
                  />
                </div>

                {/* Stop Loss Type */}
                <div>
                  <Label>Stop Loss Type</Label>
                  <Select defaultValue="atr">
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
                    <span className="text-sm font-medium text-primary">1.5x</span>
                  </div>
                  <Slider 
                    defaultValue={[1.5]} 
                    min={0.5}
                    max={3} 
                    step={0.1}
                    className="mb-2"
                  />
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
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
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
                  <span className="text-sm font-medium text-primary">5</span>
                </div>
                <Slider 
                  defaultValue={[5]} 
                  min={1}
                  max={10} 
                  step={1}
                  className="mb-2"
                />
              </div>

              {/* Daily Loss Limit */}
              <div>
                <Label>Daily Loss Limit</Label>
                <div className="flex gap-2 mt-2">
                  <Input 
                    type="number" 
                    placeholder="1000" 
                    className="flex-1"
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
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-loss" />
                      <span className="text-sm">Pause trading for the day</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      <span className="text-sm">Send alert notification</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stops" className="space-y-4">
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
                <Switch defaultChecked />
              </div>

              {/* Trailing Stop */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Enable Trailing Stop</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Trailing Distance (pips)</Label>
                  <Input type="number" placeholder="20" />
                </div>
              </div>

              {/* Break Even */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Move to Break Even</Label>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Trigger at Profit (pips)</Label>
                  <Input type="number" placeholder="15" />
                </div>
              </div>

              {/* Partial Close */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Enable Partial Close</Label>
                  <Switch />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Close %</Label>
                    <Input type="number" placeholder="50" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">At Target 1</Label>
                    <Input type="number" placeholder="1.5" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskManagement;