import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Bell,
  Shield,
  Palette,
  Workflow,
  Save,
  FileSignature
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [emailSignature, setEmailSignature] = useState(`Best regards,
[Your Name]
Saudi ProTech
info@saudiprotech.com
+966 XX XXX XXXX`);

  const handleSaveSignature = () => {
    toast.success('Email signature saved successfully');
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and application preferences
          </p>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="signature" className="flex items-center gap-2">
              <FileSignature className="w-4 h-4" />
              Signature
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Email Integration</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your email inbox connection to automatically import requests.
              </p>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" placeholder="info@saudiprotech.com" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="imap">IMAP Server</Label>
                  <Input id="imap" placeholder="imap.gmail.com" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="port">Port</Label>
                    <Input id="port" placeholder="993" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Sync Frequency</Label>
                    <Input id="frequency" placeholder="5 minutes" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <Switch id="ssl" defaultChecked />
                    <Label htmlFor="ssl">Use SSL/TLS</Label>
                  </div>
                  <Button className="gradient-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signature" className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Email Signature</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your personal email signature that will be automatically added to all outgoing emails.
              </p>
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="signature">Your Signature</Label>
                  <Textarea 
                    id="signature" 
                    value={emailSignature}
                    onChange={(e) => setEmailSignature(e.target.value)}
                    placeholder="Enter your email signature..."
                    className="min-h-[150px] font-mono text-sm"
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                    {emailSignature}
                  </pre>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveSignature} className="gradient-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Save Signature
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-foreground">New Request Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when new requests arrive</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-foreground">Task Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive reminders for upcoming tasks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium text-foreground">Team Mentions</p>
                    <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">Weekly Summary</p>
                    <p className="text-sm text-muted-foreground">Receive a weekly performance report</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline Stages</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Customize your request pipeline stages.
              </p>
              
              <div className="space-y-3">
                {['New', 'Under Review', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'].map((stage, i) => (
                  <div key={stage} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {i + 1}
                    </div>
                    <Input value={stage} className="flex-1" readOnly />
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="mt-4">
                Add Stage
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 animate-fade-in">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Security Settings</h2>
              
              <div className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Switch id="2fa" />
                    <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                  </div>
                  <Button className="gradient-primary">
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
