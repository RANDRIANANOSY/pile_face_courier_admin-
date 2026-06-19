import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import {
  Package,
  Truck,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  mockDashboardKPI,
  mockDeliveryStats,
  mockMonthlyStats,
  mockDeliveryStatusDistribution,
  mockActivities,
} from '@/lib/mock-data';

export default function Dashboard() {
  const kpi = mockDashboardKPI;

  const kpiCards = [
    {
      title: 'Total Deliveries',
      value: kpi.totalDeliveries,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12.5%',
    },
    {
      title: 'Deliveries Today',
      value: kpi.deliveriesToday,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+5.2%',
    },
    {
      title: 'Pending',
      value: kpi.pendingDeliveries,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: '-2.1%',
    },
    {
      title: 'Completed',
      value: kpi.completedDeliveries,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+8.3%',
    },
    {
      title: 'Active Couriers',
      value: kpi.activeCouriers,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+1',
    },
    {
      title: 'Total Customers',
      value: kpi.totalCustomers,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: '+15',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your deliveries today.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                      <p className="text-3xl font-bold mt-2">{card.value}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {card.trend}
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs last week</span>
                      </div>
                    </div>
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`${card.color} w-6 h-6`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Deliveries Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Deliveries by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockDeliveryStats}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1E3A8A"
                    strokeWidth={2}
                    dot={{ fill: '#1E3A8A' }}
                    name="Total"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                    name="Completed"
                  />
                </LineChart>
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

        {/* Monthly Stats & Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Deliveries */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockMonthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="deliveries" fill="#1E3A8A" name="Total" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activities
                <Button variant="ghost" size="sm">
                  <ArrowRight size={16} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      {activity.type === 'completed_delivery' && (
                        <CheckCircle size={18} className="text-green-600" />
                      )}
                      {activity.type === 'delayed_delivery' && (
                        <AlertCircle size={18} className="text-orange-600" />
                      )}
                      {activity.type === 'new_delivery' && (
                        <Package size={18} className="text-blue-600" />
                      )}
                      {activity.type === 'courier_update' && (
                        <Truck size={18} className="text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
