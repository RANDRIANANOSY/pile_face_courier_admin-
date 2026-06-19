import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, Phone, Package } from 'lucide-react';
import { mockDeliveries, mockCouriers } from '@/lib/mock-data';

export default function Tracking() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const activeDeliveries = mockDeliveries.filter((d) => d.status === 'in_transit' || d.status === 'picked_up');

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor active deliveries in real-time</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Deliveries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeDeliveries.map((delivery) => (
            <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{delivery.trackingNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{delivery.sender.fullName} → {delivery.receiver.fullName}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">{delivery.status.replace('_', ' ')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Courier Info */}
                {delivery.assignedCourier && (
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {delivery.assignedCourier.fullName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{delivery.assignedCourier.fullName}</p>
                      <p className="text-xs text-muted-foreground">{delivery.assignedCourier.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {/* Route Info */}
                <div className="space-y-2">
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pickup</p>
                      <p className="text-sm font-medium">{delivery.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Package size={18} className="text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-sm font-medium">{delivery.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex gap-4 p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      <Clock size={14} />
                      {delivery.estimatedDeliveryTime}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: delivery.status === 'picked_up' ? '50%' : '75%',
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Placeholder */}
        <Card className="h-96">
          <CardHeader>
            <CardTitle>Delivery Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Google Maps integration would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
