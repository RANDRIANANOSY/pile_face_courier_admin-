import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, MoreVertical, Eye, Trash2, MapPin, Clock } from 'lucide-react';
import { mockDeliveries } from '@/lib/mock-data';
import { Delivery } from '@/types';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800',
  assigned: 'bg-blue-100 text-blue-800',
  picked_up: 'bg-purple-100 text-purple-800',
  in_transit: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  normal: 'bg-gray-50',
  urgent: 'bg-orange-50',
  express: 'bg-blue-50',
  confidential: 'bg-red-50',
};

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.sender.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteDelivery = (id: string) => {
    setDeliveries(deliveries.filter((d) => d.id !== id));
    toast.success('Delivery deleted successfully');
  };

  const handleStatusChange = (deliveryId: string, newStatus: Delivery['status']) => {
    setDeliveries(
      deliveries.map((d) =>
        d.id === deliveryId ? { ...d, status: newStatus } : d
      )
    );
    toast.success('Delivery status updated');
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deliveries</h1>
            <p className="text-muted-foreground mt-1">Manage and track all deliveries</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus size={18} className="mr-2" />
            Create Delivery
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Deliveries Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Deliveries ({filteredDeliveries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking #</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Receiver</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Courier</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id} className={priorityColors[delivery.priority]}>
                      <TableCell className="font-mono font-medium">{delivery.trackingNumber}</TableCell>
                      <TableCell className="text-sm">{delivery.sender.fullName}</TableCell>
                      <TableCell className="text-sm">{delivery.receiver.fullName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {delivery.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[delivery.status]}>
                          {delivery.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {delivery.assignedCourier ? delivery.assignedCourier.fullName : '—'}
                      </TableCell>
                      <TableCell className="text-sm">{delivery.deliveryDate}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye size={16} className="mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin size={16} className="mr-2" />
                              Track
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock size={16} className="mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteDelivery(delivery.id)}
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
    </DashboardLayout>
  );
}
