import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Building2, MapPin, Users, Lock } from 'lucide-react';

export default function Settings() {
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Pile & Face S.A',
    email: 'contact@pilefacelogistics.mg',
    phone: '+261 20 123 4567',
    address: 'Antananarivo, Madagascar',
    description: 'Leading logistics and courier service provider in Madagascar',
  });

  const [zones, setZones] = useState([
    { id: 1, name: 'Antananarivo Central', status: 'active' },
    { id: 2, name: 'Antananarivo North', status: 'active' },
    { id: 3, name: 'Antananarivo South', status: 'active' },
    { id: 4, name: 'Antananarivo East', status: 'active' },
    { id: 5, name: 'Antananarivo West', status: 'active' },
  ]);

  const [newZone, setNewZone] = useState('');

  const handleSaveCompanyInfo = () => {
    toast.success('Company information updated successfully');
  };

  const handleAddZone = () => {
    if (newZone.trim()) {
      setZones([...zones, { id: zones.length + 1, name: newZone, status: 'active' }]);
      setNewZone('');
      toast.success('Zone added successfully');
    }
  };

  const handleDeleteZone = (id: number) => {
    setZones(zones.filter((z) => z.id !== id));
    toast.success('Zone deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage system configuration and preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 size={16} />
              <span className="hidden md:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="hidden md:inline">Zones</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden md:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={16} />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Company Information Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={companyInfo.description}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleSaveCompanyInfo} className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Zones Tab */}
          <TabsContent value="zones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Zones</CardTitle>
                <CardDescription>Manage your delivery coverage areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add New Zone */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter zone name..."
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                  />
                  <Button onClick={handleAddZone} className="bg-primary hover:bg-primary/90">
                    Add Zone
                  </Button>
                </div>

                {/* Zones List */}
                <div className="space-y-2">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-primary" />
                        <div>
                          <p className="font-medium">{zone.name}</p>
                          <p className="text-xs text-muted-foreground">Active</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteZone(zone.id)}
                        className="text-destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage admin users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Jean Rakoto', role: 'Super Admin', email: 'jean@pilefacelogistics.mg' },
                    { name: 'Marie Andriana', role: 'Operations Manager', email: 'marie@pilefacelogistics.mg' },
                    { name: 'Pierre Razafindra', role: 'Dispatcher', email: 'pierre@pilefacelogistics.mg' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 bg-primary hover:bg-primary/90">Add New User</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="••••••••" />
                </div>
                <Button className="bg-primary hover:bg-primary/90">Update Password</Button>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-medium mb-3">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    You have 1 active session
                  </p>
                  <Button variant="outline" className="text-destructive">
                    Logout All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
