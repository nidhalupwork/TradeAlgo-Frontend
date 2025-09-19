import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Save, Settings2 } from 'lucide-react';

export const TradingPreferences = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings2 className="h-5 w-5" />
          Trading Preferences
        </CardTitle>
        <p className="text-sm text-muted-foreground">Configure your default trading settings and risk management</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Risk Management</h4>

            <div className="space-y-2">
              <Label htmlFor="max-risk">Max Risk Per Trade (%)</Label>
              <div className="px-3">
                <Slider id="max-risk" defaultValue={[2]} max={10} min={0.1} step={0.1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0.1%</span>
                  <span>2%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-size">Default Position Size</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Fixed Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="percentage">Percentage of Balance</SelectItem>
                  <SelectItem value="risk-based">Risk-Based Sizing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-amount">Default Amount ($)</Label>
              <Input id="default-amount" type="number" defaultValue="1000" placeholder="1000" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Trading Settings</h4>

            <div className="space-y-2">
              <Label htmlFor="slippage">Max Slippage (pips)</Label>
              <Input id="slippage" type="number" defaultValue="3" placeholder="3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="execution-delay">Execution Delay (seconds)</Label>
              <Input id="execution-delay" type="number" defaultValue="1" placeholder="1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trading-hours">Trading Hours</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="24/7" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24-7">24/7</SelectItem>
                  <SelectItem value="market-hours">Market Hours Only</SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4">Automation Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-trading">Enable Auto Trading</Label>
                <p className="text-sm text-muted-foreground">Automatically execute trades from TradingView signals</p>
              </div>
              <Switch id="auto-trading" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="confirm-trades">Require Trade Confirmation</Label>
                <p className="text-sm text-muted-foreground">Manual approval required for each trade</p>
              </div>
              <Switch id="confirm-trades" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email alerts for trades and account events</p>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-alerts">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive SMS alerts for critical account events</p>
              </div>
              <Switch id="sms-alerts" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
          <Button variant="outline">Reset to Defaults</Button>
        </div>
      </CardContent>
    </Card>
  );
};
