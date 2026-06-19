import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { mockDeliveryStats, mockMonthlyStats, mockDeliveryStatusDistribution } from '@/lib/mock-data';
import { TrendingUp, MapPin, Clock, Users } from 'lucide-react';

export default function Analytics() {
  const zoneData = [
    { zone: 'Antananarivo Central', deliveries: 245, completed: 238 },
    { zone: 'Antananarivo North', deliveries: 189, completed: 185 },
    { zone: 'Antananarivo South', deliveries: 167, completed: 162 },
    { zone: 'Antananarivo East', deliveries: 142, completed: 138 },
    { zone: 'Antananarivo West', deliveries: 156, completed: 151 },
  ];

  const timeData = [
    { time: '00:00-06:00', deliveries: 45 },
    { time: '06:00-12:00', deliveries: 128 },
    { time: '12:00-18:00', deliveries: 156 },
    { time: '18:00-24:00', deliveries: 98 },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights into delivery operations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Trends</p>
                  <p className="text-3xl font-bold mt-2">+12.5%</p>
                  <p className="text-xs text-green-600 mt-2">vs last month</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <TrendingUp className="text-blue-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Demand Zones</p>
                  <p className="text-3xl font-bold mt-2">5</p>
                  <p className="text-xs text-blue-600 mt-2">active zones</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <MapPin className="text-purple-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                  <p className="text-3xl font-bold mt-2">47 min</p>
                  <p className="text-xs text-green-600 mt-2">↓ 3% improvement</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <Clock className="text-green-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Couriers</p>
                  <p className="text-3xl font-bold mt-2">5</p>
                  <p className="text-xs text-blue-600 mt-2">on duty</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <Users className="text-indigo-600 w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Volume Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Volume Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockDeliveryStats}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#1E3A8A"
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Delivery Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockDeliveryStatusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, value }) => `${status}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockDeliveryStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Delivery by Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Deliveries by Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zoneData.map((zone) => (
                <div key={zone.zone} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{zone.zone}</p>
                    <div className="w-full bg-secondary rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(zone.completed / zone.deliveries) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium">{zone.completed}/{zone.deliveries}</p>
                    <p className="text-xs text-muted-foreground">
                      {((zone.completed / zone.deliveries) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery by Time */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Volume by Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#FF8C42"
                  strokeWidth={2}
                  dot={{ fill: '#FF8C42' }}
                  name="Deliveries"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
