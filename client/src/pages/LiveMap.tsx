import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { MapView } from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCouriers, mockDeliveries } from '@/lib/mock-data';
import { Courier } from '@/types';
import { MapPin, Navigation, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CourierMarker {
  courier: Courier;
  marker?: google.maps.marker.AdvancedMarkerElement;
}

export default function LiveMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [couriers, setCouriers] = useState<CourierMarker[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [filterZone, setFilterZone] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeliveries, setShowDeliveries] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

  // Initialize couriers on map
  useEffect(() => {
    if (!mapRef.current) return;

    const filteredCouriers = mockCouriers.filter((courier) => {
      const zoneMatch = filterZone === 'all' || courier.assignedZone === filterZone;
      const statusMatch = filterStatus === 'all' || courier.status === filterStatus;
      return zoneMatch && statusMatch && courier.currentLocation;
    });

    // Clear existing markers
    couriers.forEach((cm) => {
      if (cm.marker) {
        cm.marker.map = null;
      }
    });

    // Add new markers
    const newCouriers: CourierMarker[] = filteredCouriers.map((courier) => {
      const statusColors: Record<string, string> = {
        available: '#10b981',
        busy: '#f59e0b',
        offline: '#6b7280',
      };

      const html = `
        <div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg" style="background-color: ${statusColors[courier.status]};">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: courier.currentLocation,
        title: courier.fullName,
        content: document.createElement('div'),
      });

      const content = marker.content as HTMLElement;
      content.innerHTML = html;
      content.style.cursor = 'pointer';
      content.addEventListener('click', () => {
        setSelectedCourier(courier.id);
        mapRef.current?.setCenter(courier.currentLocation!);
        mapRef.current?.setZoom(16);
      });

      return { courier, marker };
    });

    setCouriers(newCouriers);
  }, [filterZone, filterStatus]);

  // Handle map ready
  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    directionsServiceRef.current = new google.maps.DirectionsService();
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
    });

    // Set initial center to Antananarivo
    map.setCenter({ lat: -18.8792, lng: 47.5079 });
  };

  // Simulate real-time position updates
  useEffect(() => {
    if (!autoUpdate) return;

    const interval = setInterval(() => {
      setCouriers((prev) =>
        prev.map((cm) => {
          const newLocation = {
            lat: cm.courier.currentLocation!.lat + (Math.random() - 0.5) * 0.002,
            lng: cm.courier.currentLocation!.lng + (Math.random() - 0.5) * 0.002,
          };

          if (cm.marker) {
            cm.marker.position = newLocation;
          }

          return {
            ...cm,
            courier: { ...cm.courier, currentLocation: newLocation },
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [autoUpdate]);

  // Show route for selected courier
  useEffect(() => {
    if (!selectedCourier || !directionsServiceRef.current || !directionsRendererRef.current) return;

    const courier = mockCouriers.find((c) => c.id === selectedCourier);
    if (!courier || !courier.currentLocation) return;

    // Find deliveries for this courier
    const courierDeliveries = mockDeliveries.filter((d) => d.assignedCourier?.id === selectedCourier);
    if (courierDeliveries.length === 0) return;

    // Create waypoints from deliveries
    const waypoints = courierDeliveries.slice(0, -1).map((delivery) => ({
      location: delivery.deliveryAddress,
      stopover: true,
    }));

    const request: google.maps.DirectionsRequest = {
      origin: courier.currentLocation,
      destination: courierDeliveries[courierDeliveries.length - 1].deliveryAddress,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsServiceRef.current.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRendererRef.current?.setDirections(result);
        toast.success(`Route affichée pour ${courier.fullName}`);
      } else {
        console.error('Directions request failed:', status);
      }
    });
  }, [selectedCourier]);

  // Get unique zones
  const zones = Array.from(new Set(mockCouriers.map((c) => c.assignedZone)));

  // Get selected courier details
  const selectedCourierData = selectedCourier ? mockCouriers.find((c) => c.id === selectedCourier) : null;
  const selectedCourierDeliveries = selectedCourier ? mockDeliveries.filter((d) => d.assignedCourier?.id === selectedCourier) : [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="text-primary" size={32} />
            Suivi en Direct
          </h1>
          <p className="text-muted-foreground mt-1">Visualisez la position des coursiers et les itinéraires de livraison en temps réel</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Zone</label>
            <Select value={filterZone} onValueChange={setFilterZone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Statut</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="busy">Occupé</SelectItem>
                <SelectItem value="offline">Hors ligne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant={showDeliveries ? 'default' : 'outline'}
              onClick={() => setShowDeliveries(!showDeliveries)}
              className="w-full"
            >
              {showDeliveries ? '✓' : ''} Livraisons
            </Button>
          </div>

          <div className="flex items-end">
            <Button
              variant={autoUpdate ? 'default' : 'outline'}
              onClick={() => setAutoUpdate(!autoUpdate)}
              className="w-full"
            >
              {autoUpdate ? '●' : '○'} Mise à jour
            </Button>
          </div>
        </div>

        {/* Map and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <MapView
                  initialCenter={{ lat: -18.8792, lng: 47.5079 }}
                  initialZoom={14}
                  onMapReady={handleMapReady}
                  className="h-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Courier Details */}
          <div className="space-y-4">
            {selectedCourierData ? (
              <>
                {/* Courier Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Détails du Coursier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedCourierData.avatar}
                        alt={selectedCourierData.fullName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{selectedCourierData.fullName}</p>
                        <Badge
                          variant={
                            selectedCourierData.status === 'available'
                              ? 'default'
                              : selectedCourierData.status === 'busy'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {selectedCourierData.status === 'available'
                            ? 'Disponible'
                            : selectedCourierData.status === 'busy'
                              ? 'Occupé'
                              : 'Hors ligne'}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Téléphone:</span>
                        <span className="font-medium">{selectedCourierData.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zone:</span>
                        <span className="font-medium">{selectedCourierData.assignedZone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Livraisons:</span>
                        <span className="font-medium">{selectedCourierData.totalDeliveries}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux de réussite:</span>
                        <span className="font-medium text-green-600">{selectedCourierData.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temps moyen:</span>
                        <span className="font-medium">{selectedCourierData.averageDeliveryTime} min</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSelectedCourier(null)}
                    >
                      Désélectionner
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Deliveries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Livraisons Actives ({selectedCourierDeliveries.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedCourierDeliveries.length > 0 ? (
                      selectedCourierDeliveries.map((delivery) => (
                        <div key={delivery.id} className="p-3 bg-secondary rounded-lg space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-sm">{delivery.trackingNumber}</p>
                              <p className="text-xs text-muted-foreground">{delivery.deliveryAddress}</p>
                            </div>
                            {delivery.status === 'delivered' ? (
                              <CheckCircle className="text-green-600" size={18} />
                            ) : delivery.status === 'in_transit' ? (
                              <Navigation className="text-blue-600" size={18} />
                            ) : (
                              <AlertCircle className="text-amber-600" size={18} />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {delivery.status === 'delivered'
                                ? 'Livrée'
                                : delivery.status === 'in_transit'
                                  ? 'En transit'
                                  : 'En attente'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {delivery.priority === 'urgent' ? '🔴 Urgent' : delivery.priority === 'express' ? '🟡 Express' : '🟢 Normal'}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">Aucune livraison active</p>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="mx-auto mb-3 text-muted-foreground" size={32} />
                  <p className="text-sm text-muted-foreground">
                    Cliquez sur un marqueur de coursier sur la carte pour voir les détails et l'itinéraire
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }} />
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                  <span>Occupé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6b7280' }} />
                  <span>Hors ligne</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
