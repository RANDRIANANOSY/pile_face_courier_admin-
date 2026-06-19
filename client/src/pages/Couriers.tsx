import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Activity } from 'lucide-react';
import { mockCouriers } from '@/lib/mock-data';
import { Courier } from '@/types';
import { toast } from 'sonner';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  busy: 'bg-yellow-100 text-yellow-800',
  offline: 'bg-gray-100 text-gray-800',
};

export default function Couriers() {
  const [couriers, setCouriers] = useState<Courier[]>(mockCouriers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Courier>>({
    fullName: '',
    phoneNumber: '',
    nationalId: '',
    assignedZone: '',
    status: 'available',
  });

  const filteredCouriers = couriers.filter(
    (courier) =>
      courier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courier.phoneNumber.includes(searchTerm) ||
      courier.assignedZone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourier = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      nationalId: '',
      assignedZone: '',
      status: 'available',
    });
    setSelectedCourier(null);
    setIsDialogOpen(true);
  };

  const handleEditCourier = (courier: Courier) => {
    setFormData(courier);
    setSelectedCourier(courier);
    setIsDialogOpen(true);
  };

  const handleSaveCourier = () => {
    if (!formData.fullName || !formData.phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedCourier) {
      setCouriers(
        couriers.map((c) =>
          c.id === selectedCourier.id ? { ...c, ...formData } : c
        )
      );
      toast.success('Courier updated successfully');
    } else {
      const newCourier: Courier = {
        id: `courier-${Date.now()}`,
        fullName: formData.fullName || '',
        phoneNumber: formData.phoneNumber || '',
        nationalId: formData.nationalId || '',
        assignedZone: formData.assignedZone || '',
        status: (formData.status as any) || 'available',
        totalDeliveries: 0,
        successRate: 100,
        averageDeliveryTime: 45,
        punctualityRate: 100,
      };
      setCouriers([...couriers, newCourier]);
      toast.success('Courier created successfully');
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const handleDeleteCourier = (id: string) => {
    setCouriers(couriers.filter((c) => c.id !== id));
    toast.success('Courier deleted successfully');
  };

  const handleStatusChange = (courierId: string, newStatus: 'available' | 'busy' | 'offline') => {
    setCouriers(
      couriers.map((c) =>
        c.id === courierId ? { ...c, status: newStatus } : c
      )
    );
    toast.success('Courier status updated');
  };

  const handleViewDetails = (courier: Courier) => {
    setSelectedCourier(courier);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Couriers</h1>
            <p className="text-muted-foreground mt-1">Manage your delivery team</p>
          </div>
          <Button onClick={handleAddCourier} className="bg-primary hover:bg-primary/90">
            <Plus size={18} className="mr-2" />
            Add Courier
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or zone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Couriers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Couriers ({filteredCouriers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCouriers.map((courier) => (
                    <TableRow key={courier.id}>
                      <TableCell className="font-medium">{courier.fullName}</TableCell>
                      <TableCell>{courier.phoneNumber}</TableCell>
                      <TableCell className="text-sm">{courier.assignedZone}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[courier.status]}>
                          <Activity size={12} className="mr-1" />
                          {courier.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{courier.totalDeliveries}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          {courier.successRate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{courier.averageDeliveryTime} min</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(courier)}>
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCourier(courier)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCourier(courier.id)}
                              className="text-destructive"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCourier ? 'Edit Courier' : 'Add New Courier'}</DialogTitle>
            <DialogDescription>
              {selectedCourier ? 'Update courier information' : 'Add a new courier to your team'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+261 32 123 4567"
              />
            </div>
            <div>
              <Label htmlFor="nationalId">National ID</Label>
              <Input
                id="nationalId"
                value={formData.nationalId || ''}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                placeholder="101-234567-8"
              />
            </div>
            <div>
              <Label htmlFor="assignedZone">Assigned Zone</Label>
              <Input
                id="assignedZone"
                value={formData.assignedZone || ''}
                onChange={(e) => setFormData({ ...formData, assignedZone: e.target.value })}
                placeholder="Antananarivo Central"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status || 'available'} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCourier} className="bg-primary hover:bg-primary/90">
                {selectedCourier ? 'Update' : 'Add'} Courier
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      {selectedCourier && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCourier.fullName}</DialogTitle>
              <DialogDescription>{selectedCourier.assignedZone}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCourier.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={statusColors[selectedCourier.status]}>
                    {selectedCourier.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="font-medium">{selectedCourier.totalDeliveries}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="font-medium">{selectedCourier.successRate.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Delivery Time</p>
                  <p className="font-medium">{selectedCourier.averageDeliveryTime} min</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Punctuality Rate</p>
                  <p className="font-medium">{selectedCourier.punctualityRate.toFixed(1)}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Change Status</p>
                <div className="flex gap-2">
                  {(['available', 'busy', 'offline'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={selectedCourier.status === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(selectedCourier.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
