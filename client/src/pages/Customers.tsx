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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { mockCustomers } from '@/lib/mock-data';
import { Customer } from '@/types';
import { toast } from 'sonner';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({
    fullName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setFormData({
      fullName: '',
      companyName: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
    setSelectedCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setFormData(customer);
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!formData.fullName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedCustomer) {
      setCustomers(
        customers.map((c) =>
          c.id === selectedCustomer.id ? { ...c, ...formData } : c
        )
      );
      toast.success('Customer updated successfully');
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        fullName: formData.fullName || '',
        companyName: formData.companyName || '',
        email: formData.email || '',
        phoneNumber: formData.phoneNumber || '',
        address: formData.address || '',
        registrationDate: new Date().toISOString().split('T')[0],
        totalDeliveries: 0,
        averageRating: 0,
      };
      setCustomers([...customers, newCustomer]);
      toast.success('Customer created successfully');
    }

    setIsDialogOpen(false);
    setFormData({});
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
    toast.success('Customer deleted successfully');
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground mt-1">Manage and track all your customers</p>
          </div>
          <Button onClick={handleAddCustomer} className="bg-primary hover:bg-primary/90">
            <Plus size={18} className="mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.fullName}</TableCell>
                      <TableCell>{customer.companyName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{customer.email}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.totalDeliveries}</Badge>
                      </TableCell>
                      <TableCell>
                        {customer.averageRating ? (
                          <Badge variant="outline" className="text-yellow-600">
                            ⭐ {customer.averageRating.toFixed(1)}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCustomer(customer.id)}
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
            <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {selectedCustomer ? 'Update customer information' : 'Create a new customer account'}
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
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+261 32 123 4567"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomer} className="bg-primary hover:bg-primary/90">
                {selectedCustomer ? 'Update' : 'Create'} Customer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      {selectedCustomer && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCustomer.fullName}</DialogTitle>
              <DialogDescription>{selectedCustomer.companyName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCustomer.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deliveries</p>
                  <p className="font-medium">{selectedCustomer.totalDeliveries}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-medium">⭐ {selectedCustomer.averageRating?.toFixed(1) || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{selectedCustomer.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Date</p>
                <p className="font-medium">{selectedCustomer.registrationDate}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
